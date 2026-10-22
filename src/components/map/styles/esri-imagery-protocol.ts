import maplibregl from "maplibre-gl";

// Esri World Imagery answers tiles past the local imagery depth with HTTP 200 and a
// "Map data not yet available" JPEG instead of a 404, so MapLibre never overscales.
// That depth differs per place (z17 in Boa Vista, z18 in Cunha, z19 in Fresno), so
// no fixed source maxzoom works everywhere. This protocol fills a missing tile with
// the matching part of its nearest ancestor that has imagery, upscaled.

export const ESRI_IMAGERY_PROTOCOL = "esri-imagery";

const ESRI_IMAGERY_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";

// The placeholder is ~2.5 KB. Anything this small is confirmed against Esri's
// tilemap (which reports per-tile availability) since flat water can be small too.
const PLACEHOLDER_MAX_BYTES = 4096;
const MAX_ANCESTOR_LEVELS = 5;
const TILE_SIZE = 256;

async function fetchTile(z: number, y: number, x: number, signal: AbortSignal) {
  const response = await fetch(`${ESRI_IMAGERY_URL}/tile/${z}/${y}/${x}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Esri imagery tile ${z}/${y}/${x}: ${response.status}`);
  }

  return response.blob();
}

async function hasImagery(
  z: number,
  y: number,
  x: number,
  signal: AbortSignal
) {
  try {
    const response = await fetch(
      `${ESRI_IMAGERY_URL}/tilemap/${z}/${y}/${x}/1/1`,
      { signal }
    );
    const tilemap = await response.json();
    return tilemap?.data?.[0] !== 0;
  } catch (error) {
    if (signal.aborted) {
      throw error;
    }

    // If the tilemap is unavailable, show the tile as served.
    return true;
  }
}

async function isPlaceholder(
  tile: Blob,
  z: number,
  y: number,
  x: number,
  signal: AbortSignal
) {
  return (
    tile.size <= PLACEHOLDER_MAX_BYTES && !(await hasImagery(z, y, x, signal))
  );
}

async function cropAncestor(
  ancestor: Blob,
  levels: number,
  y: number,
  x: number
) {
  const scale = 2 ** levels;
  const size = TILE_SIZE / scale;
  const image = await createImageBitmap(ancestor);
  const canvas = new OffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const context = canvas.getContext("2d");
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    (x % scale) * size,
    (y % scale) * size,
    size,
    size,
    0,
    0,
    TILE_SIZE,
    TILE_SIZE
  );
  image.close();

  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
}

async function loadImageryTile(url: string, signal: AbortSignal) {
  const [z, y, x] = url
    .replace(`${ESRI_IMAGERY_PROTOCOL}://`, "")
    .split("/")
    .map(Number);

  let tile = await fetchTile(z, y, x, signal);
  if (await isPlaceholder(tile, z, y, x, signal)) {
    for (
      let levels = 1;
      levels <= MAX_ANCESTOR_LEVELS && levels <= z;
      levels++
    ) {
      const ancestorZ = z - levels;
      const ancestorY = Math.floor(y / 2 ** levels);
      const ancestorX = Math.floor(x / 2 ** levels);
      const ancestor = await fetchTile(ancestorZ, ancestorY, ancestorX, signal);
      if (
        !(await isPlaceholder(
          ancestor,
          ancestorZ,
          ancestorY,
          ancestorX,
          signal
        ))
      ) {
        tile = await cropAncestor(ancestor, levels, y, x);
        break;
      }
    }
  }

  return { data: await tile.arrayBuffer() };
}

let registered = false;

export function registerEsriImageryProtocol() {
  if (registered || typeof window === "undefined") {
    return;
  }

  maplibregl.addProtocol(ESRI_IMAGERY_PROTOCOL, (params, abortController) =>
    loadImageryTile(params.url, abortController.signal)
  );
  registered = true;
}
