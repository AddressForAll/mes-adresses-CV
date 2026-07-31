/**
 * Split out from `contexts/map.tsx` so `src/lib/countries` can reference
 * basemap identifiers without creating a cycle (the country registry needs
 * `MapStyle`; `contexts/map.tsx` needs the country registry for
 * `getDefaultStyle`). Re-exported from `contexts/map` for existing imports.
 */
export enum MapStyle {
  ORTHO = "ortho",
  VECTOR = "vector",
  PLAN_IGN = "plan-ign",
  STREET = "street",
  SATELLITE = "satellite",
}
