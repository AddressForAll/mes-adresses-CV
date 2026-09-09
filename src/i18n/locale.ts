"use server";

import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "./config";

/**
 * Conventional next-intl cookie name, so the value stays portable if this app
 * ever moves to locale-prefixed routing.
 */
const COOKIE_NAME = "NEXT_LOCALE";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Best supported language for the incoming request:
 * explicit cookie > browser `Accept-Language` > `DEFAULT_LOCALE`.
 */
export async function getUserLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return negotiateLocale((await headers()).get("accept-language"));
}

/**
 * Server action behind the header language selector. Writing a cookie (rather
 * than `localStorage`) is what lets the server components render in the right
 * language on the very first paint, with no flash of French.
 */
export async function setUserLocale(locale: Locale): Promise<void> {
  if (!isLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  (await cookies()).set(COOKIE_NAME, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR_IN_SECONDS,
  });
}

/**
 * Minimal `Accept-Language` negotiation: highest-quality entry whose base
 * language we support (`fr-CA` matches `fr`). Hand-rolled rather than pulling
 * in `negotiator`, which is only ever a transitive dependency here.
 */
function negotiateLocale(header: string | null): Locale {
  if (!header) {
    return DEFAULT_LOCALE;
  }

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        base: tag.trim().split("-")[0].toLowerCase(),
        quality: q ? Number.parseFloat(q.trim().slice(2)) || 0 : 1,
      };
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality);

  return (
    (ranked
      .map(({ base }) => base)
      .find((base) => LOCALES.includes(base as Locale)) as
      | Locale
      | undefined) ?? DEFAULT_LOCALE
  );
}
