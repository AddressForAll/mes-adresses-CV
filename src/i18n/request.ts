import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE, type Locale } from "./config";
import { getUserLocale } from "./locale";

// Statically imported so the catalogs are part of the bundle graph: a dynamic
// `import(\`../../messages/${locale}.json\`)` resolves at runtime and breaks in
// the `output: "standalone"` build, which only traces statically-reachable files.
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";

const CATALOGS: Record<Locale, typeof fr> = { fr, en, es, pt };

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: CATALOGS[locale] ?? CATALOGS[DEFAULT_LOCALE],
  };
});
