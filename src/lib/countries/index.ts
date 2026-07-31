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
   * Which commune-search API backs this country's `/new` and BAL-recovery
   * flows. `null` means no search service is wired up yet — those flows
   * should explain how a BAL is created instead of showing a dead search box.
   * See infra/05-commune-search-and-map-coordinates.md for the contract a
   * future service must satisfy.
   */
  geoApi: "fr" | null;
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
  fr: {
    code: "fr",
    label: "France",
    basemaps: [MapStyle.ORTHO, MapStyle.VECTOR, MapStyle.PLAN_IGN],
    defaultBasemap: MapStyle.VECTOR,
    hasCadastre: true,
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
    geoApi: null,
    minInitialZoom: 13,
  },
};

export function getCountry(code: string | null | undefined): CountryProfile {
  return COUNTRIES[code] || COUNTRIES[DEFAULT_COUNTRY];
}
