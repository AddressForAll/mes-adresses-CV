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
    sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower)
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
  if (!geoApi) {
    if (voies.length > 0) {
      commune.bbox = bboxFromVoies(voies);
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
