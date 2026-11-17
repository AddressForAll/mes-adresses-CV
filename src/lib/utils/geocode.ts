/**
 * AFA.codes geocodes, as typed and shown in the editor.
 *
 * The API stores the bare code (uppercase, no separators, no country prefix;
 * `libs/shared/src/utils/geocode.utils.ts` in mes-adresses-api) and accepts
 * 1–16 letters or digits, because the format is only partly known. Display is
 * per country: Brazil shows `BR-` + `XXXXX-XXX` for 8-character codes. A code
 * of any other shape is shown as stored.
 */
export const GEOCODE_MAX_LENGTH = 16;

const GEOCODE_PATTERN = new RegExp(`^[0-9A-Z]{1,${GEOCODE_MAX_LENGTH}}$`);

export interface GeocodeFormat {
  /** Presentation prefix, without its hyphen (`BR`). */
  prefix: string;
  /** Group sizes of the display mask (`[5, 3]` → `XXXXX-XXX`). */
  groups?: number[];
}

/** Stored form of what was typed: uppercase, prefix and separators removed. */
export function normalizeGeocode(
  value: string | null | undefined,
  format?: GeocodeFormat | null
): string | null {
  if (!value) {
    return null;
  }
  let code = value.trim().toUpperCase();
  if (format?.prefix) {
    // Only a *separated* prefix is presentation: a code may itself start
    // with the same two letters.
    code = code.replace(new RegExp(`^${format.prefix}[\\s\\-_.:]+`), "");
  }
  code = code.replace(/[\s\-_.]/g, "");
  return code === "" ? null : code;
}

export function isValidGeocode(code: string): boolean {
  return GEOCODE_PATTERN.test(code);
}

/** Code grouped by the country's mask, without the prefix (`R7FGJ-2Z2`). */
export function formatGeocode(
  code: string | null | undefined,
  format?: GeocodeFormat | null
): string {
  if (!code) {
    return "";
  }
  const groups = format?.groups;
  const total = groups?.reduce((sum, size) => sum + size, 0);
  if (!groups || code.length !== total) {
    return code;
  }
  const parts: string[] = [];
  let start = 0;
  for (const size of groups) {
    parts.push(code.slice(start, start + size));
    start += size;
  }
  return parts.join("-");
}

/** Code as presented to readers, with its prefix (`BR-R7FGJ-2Z2`). */
export function displayGeocode(
  code: string | null | undefined,
  format?: GeocodeFormat | null
): string {
  if (!code) {
    return "";
  }
  const grouped = formatGeocode(code, format);
  return format?.prefix ? `${format.prefix}-${grouped}` : grouped;
}
