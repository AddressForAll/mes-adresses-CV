#!/usr/bin/env node
/**
 * Validates the message catalogs in `messages/`:
 *
 *   1. every locale has exactly the same set of keys (no half-translated key
 *      silently falling back to the key name at runtime);
 *   2. every message is valid ICU that actually compiles;
 *   3. every message uses the same set of placeholders and rich-text tags
 *      across locales — a tag present in the source but missing from a
 *      translation renders as literal angle brackets to the user.
 *
 * Run with `yarn check-i18n`. Exits non-zero on any error.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { IntlMessageFormat } from "intl-messageformat";
import { TYPE } from "@formatjs/icu-messageformat-parser";

const MESSAGES_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "messages"
);
const REFERENCE_LOCALE = "fr";

const locales = readdirSync(MESSAGES_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const catalogs = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf8")),
  ])
);

/** Flattens a nested catalog into dotted key -> string. */
function flatten(node, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      flatten(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}

/**
 * ICU argument names and rich-text tag names used by a message, collected by
 * walking the parsed AST. A regex cannot do this correctly: the branch bodies
 * of a plural (`{count, plural, one {voie} other {voies}}`) are literal text,
 * not arguments, and must not be compared across locales.
 */
function tokensOf(message, locale) {
  const tokens = new Set();

  const walk = (elements) => {
    for (const element of elements) {
      switch (element.type) {
        case TYPE.argument:
        case TYPE.number:
        case TYPE.date:
        case TYPE.time:
          tokens.add(`{${element.value}}`);
          break;
        case TYPE.select:
        case TYPE.plural:
          tokens.add(`{${element.value}}`);
          // Branch bodies are translatable prose — only their nested
          // placeholders and tags matter.
          for (const option of Object.values(element.options)) {
            walk(option.value);
          }
          break;
        case TYPE.tag:
          tokens.add(`<${element.value}>`);
          walk(element.children);
          break;
        default:
          break;
      }
    }
  };

  walk(new IntlMessageFormat(message, locale).ast);
  return tokens;
}

const flat = Object.fromEntries(
  locales.map((locale) => [locale, flatten(catalogs[locale])])
);
const errors = [];

// 1. key parity
const referenceKeys = new Set(Object.keys(flat[REFERENCE_LOCALE]));
for (const locale of locales) {
  if (locale === REFERENCE_LOCALE) continue;
  for (const key of referenceKeys) {
    if (!(key in flat[locale])) errors.push(`${locale}: missing key "${key}"`);
  }
  for (const key of Object.keys(flat[locale])) {
    if (!referenceKeys.has(key)) {
      errors.push(`${locale}: extra key "${key}" (not in ${REFERENCE_LOCALE})`);
    }
  }
}

// 2. ICU compiles, and 3. placeholders/tags match the reference locale
for (const locale of locales) {
  for (const [key, message] of Object.entries(flat[locale])) {
    if (typeof message !== "string") {
      errors.push(`${locale}: "${key}" is not a string`);
      continue;
    }
    try {
      new IntlMessageFormat(message, locale);
    } catch (err) {
      errors.push(`${locale}: "${key}" is not valid ICU — ${err.message}`);
      continue;
    }
    const reference = flat[REFERENCE_LOCALE][key];
    if (locale === REFERENCE_LOCALE || reference === undefined) continue;

    const expected = tokensOf(reference, REFERENCE_LOCALE);
    const actual = tokensOf(message, locale);
    for (const token of expected) {
      if (!actual.has(token)) {
        errors.push(`${locale}: "${key}" is missing ${token}`);
      }
    }
    for (const token of actual) {
      if (!expected.has(token)) {
        errors.push(`${locale}: "${key}" has unexpected ${token}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`✗ ${errors.length} i18n problem(s):\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(
  `✓ ${locales.join(", ")} — ${referenceKeys.size} keys, all in parity and valid ICU`
);
