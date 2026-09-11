/**
 * Supported UI languages.
 *
 * This app has **no `[locale]` URL segment and no middleware** — every route is
 * language-neutral and the active language lives in the `NEXT_LOCALE` cookie
 * (see `src/i18n/locale.ts`). That keeps every existing URL, bookmark and
 * `/bal/<id>` share link working unchanged, which matters because BAL links are
 * mailed out to town halls and cannot be rewritten after the fact.
 */
export const LOCALES = ["fr", "en", "es", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Language used when the visitor has no cookie and their browser asks for
 * nothing we speak. English, because this fork is an international demo —
 * upstream mes-adresses is French-only. Overridable per deployment with
 * `NEXT_PUBLIC_DEFAULT_LOCALE` (it is a build-time value; see the compose
 * files), so a French-facing deployment can set `fr` without a code change.
 */
export const DEFAULT_LOCALE: Locale = isLocale(
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE
)
  ? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale)
  : "en";

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Display name of each language, written in that language. */
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
};
