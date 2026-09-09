/**
 * Position types as stored by the API (`Position.type`). The `value` strings
 * are the French enum members persisted in the database — they are data, not
 * copy, and must never be translated. `key` addresses the display label in the
 * `positionTypes` catalog namespace: `t(getPositionTypeKey(value))`.
 */
export const positionsTypesList = [
  { value: "entrée", key: "entree" },
  { value: "délivrance postale", key: "delivrancePostale" },
  { value: "bâtiment", key: "batiment" },
  { value: "cage d’escalier", key: "cageEscalier" },
  { value: "logement", key: "logement" },
  { value: "parcelle", key: "parcelle" },
  { value: "segment", key: "segment" },
  { value: "service technique", key: "serviceTechnique" },
];

/**
 * Catalog key for a stored position type. Falls back to the raw value so an
 * enum member added API-side surfaces as itself rather than crashing the
 * lookup — next-intl renders a missing key as the key itself.
 */
export const getPositionTypeKey = (value: string): string => {
  const position = positionsTypesList.find(
    (position) => position.value === value
  );
  return position ? position.key : value;
};
