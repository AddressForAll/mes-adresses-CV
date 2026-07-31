"use client";

import { useContext, useEffect } from "react";
import CountryContext from "@/contexts/country";

/**
 * Pushes the open BAL's own country into the global CountryContext so the
 * header selector can never contradict the BAL actually being edited — see
 * `src/app/bal/[balId]/layout.tsx`, which knows `baseLocale.country` from its
 * server-side fetch before any client context mounts.
 */
export default function BalCountryOverride({ country }: { country: string }) {
  const { setOverride } = useContext(CountryContext);

  useEffect(() => {
    setOverride(country);
    return () => setOverride(null);
  }, [country, setOverride]);

  return null;
}
