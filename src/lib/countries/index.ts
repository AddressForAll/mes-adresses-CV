import { MapStyle } from "@/lib/map-style";

export interface CountryProfile {
  code: string;
  label: string;
  /** Basemaps offered for this country, in display order. */
  basemaps: MapStyle[];
  defaultBasemap: MapStyle;
  /** French cadastre (parcelles) only exists for French territories. */
  hasCadastre: boolean;
  /**
   * Whether `/new` offers to start from the national address base (the
   * French BAN). Elsewhere the BAL starts empty (or from a CSV) — loading a
   * whole territory from Overture is the CLI importer's job.
   */
  hasBanImport: boolean;
  /**
   * How this country's `/new` flow picks the territory a BAL is created for:
   * - `"fr"`: free-text search against geo.api.gouv.fr (upstream behaviour).
   * - `"territories"`: cascading selectors (state → county → place for the
   *   US) over our API's `/v2/territories`, built from Overture divisions.
   * - `null`: nothing wired up yet — the flow explains how a BAL is created
   *   instead of showing a dead search box.
   * See infra/05-commune-search-and-map-coordinates.md for the contract a
   * future service must satisfy.
   */
  geoApi: "fr" | "territories" | null;
  /**
   * Level keys of the `"territories"` selectors, largest first — they name
   * the dropdowns (`territorySelector.levels.<key>`) and must match the
   * levels of the API's catalog for this country.
   */
  territoryLevels?: string[];
  /**
   * Floor applied to the initial camera zoom when a BAL first opens (see
   * `getCommuneWithBBox` / `map.tsx`'s `cameraForBounds`). A territory-sized
   * bbox (a US county, say) would otherwise center below the BAL tiles'
   * `minZoom` (13 — `apps/api/.../tiles/const/zoom.const.ts`) and render
   * nothing. Left `undefined` for `fr`, where communes are small enough that
   * this never triggers.
   */
  minInitialZoom?: number;
}

export const DEFAULT_COUNTRY = "fr";

export const COUNTRIES: Record<string, CountryProfile> = {
  br: {
    code: "br",
    label: "Brasil",
    basemaps: [MapStyle.SATELLITE, MapStyle.STREET],
    defaultBasemap: MapStyle.SATELLITE,
    hasCadastre: false,
    hasBanImport: false,
    geoApi: "territories",
    territoryLevels: ["state", "municipality"],
    minInitialZoom: 13,
  },
  fr: {
    code: "fr",
    label: "France",
    basemaps: [MapStyle.ORTHO, MapStyle.VECTOR, MapStyle.PLAN_IGN],
    defaultBasemap: MapStyle.VECTOR,
    hasCadastre: true,
    hasBanImport: true,
    geoApi: "fr",
  },
  us: {
    code: "us",
    label: "United States",
    // Satellite first, to match France's imagery-first default
    // (commune.hasOrtho ? ORTHO : VECTOR in contexts/map.tsx) — French BALs
    // open on aerial photography for nearly every commune, so a US BAL
    // defaulting to the plain street map instead reads as broken.
    basemaps: [MapStyle.SATELLITE, MapStyle.STREET],
    defaultBasemap: MapStyle.SATELLITE,
    hasCadastre: false,
    hasBanImport: false,
    geoApi: "territories",
    territoryLevels: ["state", "county", "place"],
    minInitialZoom: 13,
  },
};

export function getCountry(code: string | null | undefined): CountryProfile {
  return COUNTRIES[code] || COUNTRIES[DEFAULT_COUNTRY];
}

/**
 * Country of a territory-catalog code (`US-197cfe35` → `"us"`), or `null` for
 * anything else — a French INSEE code in particular. Mirrors the API's
 * `territoryCodeFromDivision`.
 */
export function getTerritoryCodeCountry(code: string): string | null {
  const match = /^([A-Z]{2})-[0-9a-f]{8}$/.exec(code || "");
  const country = match?.[1].toLowerCase();
  return country && COUNTRIES[country]?.geoApi === "territories"
    ? country
    : null;
}

/** Country a commune/territory code belongs to — French when not a catalog code. */
export function getCommuneCountry(code: string): string {
  return getTerritoryCodeCountry(code) ?? "fr";
}
