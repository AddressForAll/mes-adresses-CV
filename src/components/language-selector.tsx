"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { SelectMenu, Button, Position, TranslateIcon } from "evergreen-ui";

import { setUserLocale } from "@/i18n/locale";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";

/**
 * Header language switcher, sitting next to `CountrySelector`. Country and
 * language are deliberately independent: a US commune may well be edited by a
 * French-speaking operator, so picking a country must never silently reassign
 * the UI language.
 */
function LanguageSelector() {
  const t = useTranslations("language");
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const onSelect = (locale: Locale) => {
    if (locale === activeLocale) {
      return;
    }

    startTransition(async () => {
      await setUserLocale(locale);
      // The catalog is chosen server-side from the cookie we just wrote, so the
      // tree has to be re-rendered from the server to pick up the new language.
      router.refresh();
    });
  };

  return (
    <SelectMenu
      closeOnSelect
      position={Position.BOTTOM_RIGHT}
      title={t("title")}
      hasFilter={false}
      options={LOCALES.map((locale) => ({
        label: LOCALE_LABELS[locale],
        value: locale,
      }))}
      selected={activeLocale}
      onSelect={(item) => onSelect(item.value as Locale)}
    >
      <Button
        appearance="minimal"
        marginRight={12}
        minHeight={55}
        iconBefore={TranslateIcon}
        isLoading={isPending}
        aria-label={t("title")}
      >
        {LOCALE_LABELS[activeLocale]}
      </Button>
    </SelectMenu>
  );
}

export default LanguageSelector;
