"use client";

import { useContext } from "react";
import { SelectMenu, Button, Badge, Position } from "evergreen-ui";
import { useTranslations } from "next-intl";

import CountryContext from "@/contexts/country";

/**
 * Interactive on `/`, `/new` and BAL recovery — drives which country's
 * commune search is used to create/recover a BAL. Inside a BAL editor,
 * `BalCountryOverride` (see `src/components/bal-country-override.tsx`) locks
 * this to that BAL's own country, and it renders as a read-only badge so it
 * can never contradict the BAL actually open.
 */
function CountrySelector() {
  const { country, countryProfile, countries, setCountry, isOverridden } =
    useContext(CountryContext);
  const t = useTranslations("country");

  if (isOverridden) {
    return (
      <Badge color="neutral" marginRight={12}>
        {countryProfile.label}
      </Badge>
    );
  }

  return (
    <SelectMenu
      closeOnSelect
      position={Position.BOTTOM_RIGHT}
      title={t("title")}
      hasFilter={false}
      options={countries.map(({ code, label }) => ({
        label,
        value: code,
      }))}
      selected={country}
      onSelect={(item) => setCountry(item.value as string)}
    >
      <Button appearance="minimal" marginRight={12} minHeight={55}>
        {countryProfile.label}
      </Button>
    </SelectMenu>
  );
}

export default CountrySelector;
