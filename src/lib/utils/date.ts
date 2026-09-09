/**
 * Date helpers. Anything user-visible is locale-driven: these take the active
 * locale (from `useLocale()`) rather than baking in `fr-FR`, and use `Intl`
 * rather than `date-fns/locale`, which would need a separate locale object
 * bundled per supported language.
 */

export type DurationUnit = "days" | "hours" | "minutes" | "seconds";

/**
 * Coarsest non-zero unit between two dates, as data rather than text — the
 * caller renders it through the `duration` catalog namespace so the plural
 * rules are the target language's, not French's.
 */
export const getDuration = (
  start: Date,
  end: Date = new Date()
): { unit: DurationUnit; value: number } => {
  const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return { unit: "days", value: days };
  if (hours > 0) return { unit: "hours", value: hours };
  if (minutes > 0) return { unit: "minutes", value: minutes };
  return { unit: "seconds", value: seconds };
};

/** Ex (fr): "mercredi 1 janvier 2023" — (en): "Wednesday, January 1, 2023". */
export const getLongFormattedDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Same shape as `getLongFormattedDate`; kept as a separate name for callers. */
export const getFullDate = (date: Date, locale: string) =>
  getLongFormattedDate(date, locale);

export const hasBeenSentRecently = (sentAt: Date) => {
  const now = new Date();

  const floodLimitTime = new Date(sentAt);
  floodLimitTime.setMinutes(floodLimitTime.getMinutes() + 5);
  return now < floodLimitTime;
};
