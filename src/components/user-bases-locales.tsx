"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { Pane, Spinner } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import BasesLocalesList from "@/components/bases-locales-list";
import {
  ExtendedBaseLocaleDTO,
  BaseLocaleWithHabilitationDTO,
  BasesLocalesService,
} from "@/lib/openapi-api-bal";
import { sortBalByUpdate } from "@/lib/utils/sort-bal";
import HomeDrawer from "./home-drawer";

function UserBasesLocales() {
  const { balAccess } = useContext(LocalStorageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [basesLocales, setBasesLocales] = useState<
    Array<BaseLocaleWithHabilitationDTO & { token: string }>
  >([]);
  const [publicBasesLocales, setPublicBasesLocales] = useState<
    ExtendedBaseLocaleDTO[]
  >([]);

  const getUserBals = useCallback(async () => {
    if (balAccess) {
      const ids = Object.keys(balAccess);
      const basesLocalesResponse =
        await BasesLocalesService.findManyBaseLocales({ ids });

      const basesLocales: Array<
        BaseLocaleWithHabilitationDTO & { token: string }
      > = basesLocalesResponse.map((baseLocale) => ({
        ...baseLocale,
        token: balAccess[baseLocale.id],
      }));

      const orderedBALs = sortBalByUpdate<
        BaseLocaleWithHabilitationDTO & { token: string }
      >(basesLocales.filter(Boolean));

      setBasesLocales(orderedBALs);
    }

    setIsLoading(false);
  }, [balAccess]);

  useEffect(() => {
    if (balAccess !== undefined && isLoading) {
      getUserBals();
    }
  }, [balAccess, getUserBals, isLoading]);

  useEffect(() => {
    async function getPublicBals() {
      try {
        const response = await BasesLocalesService.searchBaseLocale(
          "100",
          "0",
          "false",
          undefined,
          undefined,
          undefined,
          ExtendedBaseLocaleDTO.importType.OVERTURE
        );
        // Keep this defensive filter even though the API accepts importType:
        // during a rolling deployment an older API may ignore the new query
        // parameter and return unrelated BALs.
        setPublicBasesLocales(
          response.results.filter(
            ({ importType }) =>
              importType === ExtendedBaseLocaleDTO.importType.OVERTURE
          )
        );
      } catch (error) {
        console.error("Error fetching public Local Address Bases:", error);
      }
    }

    void getPublicBals();
  }, []);

  if (balAccess === undefined || isLoading) {
    return (
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        <Spinner />
      </Pane>
    );
  }

  return (
    <Pane position="relative" display="flex" overflow="hidden" flex={1}>
      <Pane
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="flex-start"
        overflowY="auto"
      >
        <BasesLocalesList
          initialBasesLocales={basesLocales}
          publicBasesLocales={publicBasesLocales}
        />
      </Pane>
      <HomeDrawer />
    </Pane>
  );
}

export default UserBasesLocales;
