import { useCallback, useContext, useState } from "react";
import { Paragraph, Pane, Text, Button, defaultTheme } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import BalDataContext from "@/contexts/bal-data";

import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  Toponyme,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import DialogWarningAction from "@/components/dialog-warning-action";
import MapContext from "@/contexts/map";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface WarningVoieEmptyProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function WarningVoieEmpty({ baseLocale, voie }: WarningVoieEmptyProps) {
  const t = useTranslations("warnings");
  const {
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync,
    reloadVoieAlerts,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);
  const [toConvert, setToConvert] = useState<ExtendedVoieDTO | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);
  const { toaster } = useContext(LayoutContext);
  const router = useRouter();

  const onConvert = useCallback(async () => {
    setOnConvertLoading(true);
    const convertToponyme = toaster(
      async () => {
        const toponyme: Toponyme = await VoiesService.convertToToponyme(
          toConvert.id
        );
        const voies = await reloadVoies();
        await reloadToponymes();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        // RELOAD ALERTS
        reloadVoieAlerts(toConvert, voies);
        await router.push(
          `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`
        );
      },
      t("convertSuccess"),
      t("convertError")
    );

    await convertToponyme();
    matomoTrackEvent(
      MatomoEventCategory.QUALITY,
      MatomoEventAction[MatomoEventCategory.QUALITY].CONVERT_VOIE_TO_TOPONYME
    );

    setOnConvertLoading(false);
    setToConvert(null);
  }, [
    toaster,
    matomoTrackEvent,
    toConvert,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    reloadTiles,
    refreshBALSync,
    reloadVoieAlerts,
    baseLocale.id,
    router,
  ]);

  return (
    <>
      <DialogWarningAction
        confirmLabel={t("convertConfirm")}
        isShown={Boolean(toConvert)}
        content={<Paragraph>{t("convertConfirmQuestion")}</Paragraph>}
        isLoading={onConvertLoading}
        onCancel={() => {
          setToConvert(null);
        }}
        onConfirm={onConvert}
      />
      <>
        <Pane marginBottom={8}>
          <Text>{t("voieEmptyText")}</Text>
        </Pane>
        <Button
          onClick={() => setToConvert(voie)}
          size="small"
          title={t("convertTitle")}
          appearance="primary"
          style={{ backgroundColor: defaultTheme.colors.purple600 }}
        >
          {t("convertConfirm")}
        </Button>
      </>
    </>
  );
}

export default WarningVoieEmpty;
