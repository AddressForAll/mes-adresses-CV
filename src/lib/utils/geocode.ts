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

/** Exact code length where the country's mask is known (8 for Brazil). */
export function geocodeLength(format?: GeocodeFormat | null): number | null {
  return format?.groups?.reduce((sum, size) => sum + size, 0) ?? null;
}

/**
 * Whether a stored-form code is acceptable for the country: letters and
 * digits, and exactly the mask's length where one is known.
 */
export function isValidGeocode(
  code: string,
  format?: GeocodeFormat | null
): boolean {
  const length = geocodeLength(format);
  return GEOCODE_PATTERN.test(code) && (!length || code.length === length);
}

const NOT_CODE_CHARACTER = /[^0-9A-Z]/g;

/**
 * Live mask for the geocode input. Keeps letters and digits only (accents,
 * punctuation and spaces are dropped), uppercases, drops a pasted `BR-`
 * prefix, caps the length, and puts hyphens between the mask's groups
 * (`r7fgj2z2` → `R7FGJ-2Z2`). While typing forward, a hyphen is added as
 * soon as a group fills up; when deleting it isn't, or backspace could
 * never remove it.
 *
 * `caret` is the cursor position in `value`; the result says where it lands
 * in the masked text, so editing mid-code doesn't throw it to the end.
 */
export function maskGeocodeInput(
  value: string,
  format: GeocodeFormat | null | undefined,
  { caret = value.length, isDeleting = false } = {}
): { value: string; caret: number } {
  let raw = value.toUpperCase();
  let rawCaret = caret;
  if (format?.prefix) {
    const prefix = new RegExp(`^\\s*${format.prefix}[\\s\\-_.:]+`).exec(raw);
    if (prefix) {
      raw = raw.slice(prefix[0].length);
      rawCaret = Math.max(0, rawCaret - prefix[0].length);
    }
  }
  const maxLength = geocodeLength(format) ?? GEOCODE_MAX_LENGTH;
  // Over the limit, drop characters at the cursor (what was just typed or
  // pasted), not at the end: typing into a full code changes nothing.
  const after = raw.slice(rawCaret).replace(NOT_CODE_CHARACTER, "");
  const before = raw
    .slice(0, rawCaret)
    .replace(NOT_CODE_CHARACTER, "")
    .slice(0, Math.max(0, maxLength - after.length));
  const code = (before + after).slice(0, maxLength);
  const codeBeforeCaret = before.length;

  const groups = format?.groups;
  if (!groups) {
    return { value: code, caret: codeBeforeCaret };
  }
  let masked = "";
  let maskedCaret = 0;
  let start = 0;
  for (const [index, size] of groups.entries()) {
    const part = code.slice(start, start + size);
    if (!part) {
      break;
    }
    if (index > 0) {
      masked += "-";
    }
    masked += part;
    if (codeBeforeCaret >= start) {
      maskedCaret = masked.length - part.length + (codeBeforeCaret - start);
    }
    start += size;
    const isLastGroup = index === groups.length - 1;
    if (part.length === size && !isLastGroup && !isDeleting) {
      if (code.length === start) {
        masked += "-";
        if (codeBeforeCaret === start) {
          maskedCaret = masked.length;
        }
      }
    }
  }
  return { value: masked, caret: Math.min(maskedCaret, masked.length) };
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
