import { useCallback, useContext, useMemo, useState } from "react";
import { Paragraph, Pane, Text, Button, defaultTheme } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { normalize } from "@ban-team/adresses-util/lib/voies";

import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import DialogWarningAction from "@/components/dialog-warning-action";
import { useFusionVoies } from "@/hooks/fusion-voies";
import { useRouter } from "next/navigation";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";

interface WarningVoieDoublonProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function WarningVoieDoublon({ voie }: WarningVoieDoublonProps) {
  const t = useTranslations("warnings");
  const { baseLocale, voies } = useContext(BalDataContext);
  const [toFusion, setToFusion] = useState<ExtendedVoieDTO | null>(null);
  const [onFusionLoading, setOnFusionLoading] = useState<boolean>(false);
  const router = useRouter();
  const { onFusionVoie } = useFusionVoies(setOnFusionLoading);

  const otherVoieIds = useMemo(() => {
    const voieNomNormalize = normalize(voie.nom);
    return voies
      .filter(
        ({ id, nom }) => id !== voie.id && normalize(nom) === voieNomNormalize
      )
      .map(({ id }) => id);
  }, [voie, voies]);

  const handleFusionVoies = useCallback(async () => {
    await onFusionVoie(toFusion);
    await router.push(
      `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${toFusion.id}/numeros`
    );
  }, [baseLocale.id, onFusionVoie, router, toFusion]);

  return (
    <>
      <DialogWarningAction
        confirmLabel={t("mergeConfirm")}
        isShown={Boolean(toFusion)}
        content={
          <Paragraph>
            {t("mergeConfirmQuestion", {
              count: otherVoieIds.length + 1,
              voieName: voie.nom,
            })}
          </Paragraph>
        }
        isLoading={onFusionLoading}
        onCancel={() => {
          setToFusion(null);
        }}
        onConfirm={() => handleFusionVoies()}
      />
      <>
        <Pane marginBottom={8}>
          <Text>{t("doublonText")}</Text>
        </Pane>
        <Button
          onClick={() => setToFusion(voie)}
          size="small"
          title={t("mergeTitle")}
          appearance="primary"
          style={{ backgroundColor: defaultTheme.colors.purple600 }}
        >
          {t("mergeConfirm")}
        </Button>
      </>
    </>
  );
}

export default WarningVoieDoublon;
