import { CommuneType } from "@/types/commune";
import {
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
} from "./openapi-api-bal";
import { ApiGeoService } from "./geo-api";
import { getCountry } from "@/lib/countries";
import bbox from "@turf/bbox";

function percentile(sortedValues: number[], p: number): number {
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sortedValues[lower];
  }
  return (
    sortedValues[lower] +
    (sortedValues[upper] - sortedValues[lower]) * (index - lower)
  );
}

/**
 * A territory-sized set of voies (a whole US county, say) can include a
 * handful of far-flung outliers — a road up in the foothills, miles from the
 * addressed grid — whose plain min/max union drags the bbox centre off into
 * empty space. The 5th/95th percentile of each edge trims those outliers
 * while a plain union (used below `MIN_VOIES_FOR_PERCENTILE_BBOX`, where
 * percentiles are noisy and communes are small enough that trimming isn't
 * needed anyway) stays exact.
 */
const MIN_VOIES_FOR_PERCENTILE_BBOX = 20;

type WeightedCoordinate = {
  coordinate: number;
  weight: number;
};

function weightedMedian(values: WeightedCoordinate[]): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  const sortedValues = [...values].sort((a, b) => a.coordinate - b.coordinate);
  const totalWeight = sortedValues.reduce(
    (total, { weight }) => total + weight,
    0
  );
  let cumulativeWeight = 0;

  for (const { coordinate, weight } of sortedValues) {
    cumulativeWeight += weight;
    if (cumulativeWeight >= totalWeight / 2) {
      return coordinate;
    }
  }
}

/**
 * Approximate the median address position from data already returned with the
 * voie list. Each voie centroid is weighted by its number of addresses, so a
 * dense town street contributes more than a sparsely addressed rural road.
 * A median is deliberately used instead of a mean to resist distant points.
 */
function addressWeightedCenter(
  voies: ExtendedVoieDTO[]
): [number, number] | undefined {
  const weightedCentroids = voies.flatMap((voie) => {
    const coordinates = voie.centroid?.coordinates;
    const weight = voie.nbNumeros;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2 ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1]) ||
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return [];
    }

    return [{ longitude: coordinates[0], latitude: coordinates[1], weight }];
  });

  const longitude = weightedMedian(
    weightedCentroids.map(({ longitude, weight }) => ({
      coordinate: longitude,
      weight,
    }))
  );
  const latitude = weightedMedian(
    weightedCentroids.map(({ latitude, weight }) => ({
      coordinate: latitude,
      weight,
    }))
  );

  return longitude === undefined || latitude === undefined
    ? undefined
    : [longitude, latitude];
}

function bboxFromVoies(voies: ExtendedVoieDTO[]): number[] {
  const bboxs = voies.map(({ bbox }) => bbox);

  if (bboxs.length < MIN_VOIES_FOR_PERCENTILE_BBOX) {
    return [
      Math.min(...bboxs.map((b) => b[0])),
      Math.min(...bboxs.map((b) => b[1])),
      Math.max(...bboxs.map((b) => b[2])),
      Math.max(...bboxs.map((b) => b[3])),
    ];
  }

  const minLons = bboxs.map((b) => b[0]).sort((a, b) => a - b);
  const minLats = bboxs.map((b) => b[1]).sort((a, b) => a - b);
  const maxLons = bboxs.map((b) => b[2]).sort((a, b) => a - b);
  const maxLats = bboxs.map((b) => b[3]).sort((a, b) => a - b);

  return [
    percentile(minLons, 0.05),
    percentile(minLats, 0.05),
    percentile(maxLons, 0.95),
    percentile(maxLats, 0.95),
  ];
}

export async function getCommuneWithBBox(
  baseLocale: ExtendedBaseLocaleDTO,
  voies: ExtendedVoieDTO[]
): Promise<CommuneType> {
  const commune: CommuneType = await CommuneService.findCommune(
    baseLocale.commune
  );

  const { geoApi } = getCountry(baseLocale.country);
  if (geoApi !== "fr") {
    // Frame the addresses when there are some. A fresh BAL has none, so fall
    // back to the territory's own bbox, which our API returns for catalog
    // codes (`/v2/commune/:code`) — otherwise the map would open on France.
    if (voies.length > 0) {
      commune.bbox = bboxFromVoies(voies);
      commune.initialCenter = addressWeightedCenter(voies);
    } else if (commune.bbox) {
      commune.isTerritoryBBox = true;
    }
    return commune;
  }

  try {
    const communeApiGeo = await ApiGeoService.getCommune(baseLocale.commune, {
      fields: "contour",
    });
    if (communeApiGeo.contour) {
      commune.bbox = bbox(communeApiGeo.contour);
      commune.contour = communeApiGeo.contour;
    }
  } catch {
    if (voies.length > 0) {
      commune.bbox = bboxFromVoies(voies);
    }
  }

  return commune;
}
