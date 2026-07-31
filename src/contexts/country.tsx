"use client";

import React, { useContext, useMemo, useState, useCallback } from "react";
import LocalStorageContext from "@/contexts/local-storage";
import { ChildrenProps } from "@/types/context";
import {
  COUNTRIES,
  CountryProfile,
  DEFAULT_COUNTRY,
  getCountry,
} from "@/lib/countries";

interface CountryContextType {
  /** Effective country: the BAL override when inside a BAL, else the user's selection. */
  country: string;
  countryProfile: CountryProfile;
  countries: CountryProfile[];
  /** No-op while a BAL override is active — the selector should not be interactive then. */
  setCountry: (code: string) => void;
  /**
   * True once a BAL editor route has pushed its own country in — the header
   * should render a read-only badge instead of a selector.
   */
  isOverridden: boolean;
  /**
   * Set by the BAL editor layout (see `src/app/bal/[balId]/layout.tsx`) so the
   * global selector can never contradict the BAL actually open. Pass `null`
   * to clear on unmount.
   */
  setOverride: (code: string | null) => void;
}

const CountryContext = React.createContext<CountryContextType | null>(null);

export function CountryContextProvider(props: ChildrenProps) {
  const { selectedCountry, setSelectedCountry } = useContext(
    LocalStorageContext
  );
  const [override, setOverride] = useState<string | null>(null);

  const country = override || selectedCountry || DEFAULT_COUNTRY;

  const setCountry = useCallback(
    (code: string) => {
      if (!override) {
        setSelectedCountry(code);
      }
    },
    [override, setSelectedCountry]
  );

  const value = useMemo(
    () => ({
      country,
      countryProfile: getCountry(country),
      countries: Object.values(COUNTRIES),
      setCountry,
      isOverridden: override !== null,
      setOverride,
    }),
    [country, setCountry, override]
  );

  return <CountryContext.Provider value={value} {...props} />;
}

export default CountryContext;
