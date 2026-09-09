"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import {
  Pane,
  Text,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  ArrowLeftIcon,
  TickCircleIcon,
  ChevronRightIcon,
  CrossIcon,
  defaultTheme,
  Badge,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import {
  AlertVoie,
  AlertNumero,
  AlertModelEnum,
  AlertCodeVoieEnum,
  isAlertCodeVoieEnum,
  isAlertCodeNumeroEnum,
} from "@/lib/alerts/alerts.types";
import {} from "@/lib/alerts/alerts.definitions";
import { isAlertVoieNom } from "@/lib/alerts/utils/alerts-voies.utils";
import {
  ExtendedVoieDTO,
  NumerosService,
  VoiesService,
} from "@/lib/openapi-api-bal";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import LayoutContext from "@/contexts/layout";
import AlertNameDiff from "./alert-name-diff";
import {
  isAlertNumeroSuffixe,
  isAlertNumeroParcelle,
} from "@/lib/alerts/utils/alerts-numero.utils";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { useFusionVoies } from "@/hooks/fusion-voies";

export interface AlertBatchItem {
  voie: ExtendedVoieDTO;
  alert: AlertVoie | AlertNumero;
  numeroId?: string;
}

interface AlertsBatchProcessorProps {
  items: AlertBatchItem[];
  onClose: () => void;
  onFinish: () => void;
}

function AlertsBatchProcessor({
  items,
  onClose,
  onFinish,
}: AlertsBatchProcessorProps) {
  const ta = useTranslations("alertDefinitions");
  const t = useTranslations("alertsBatch");
  const tc = useTranslations("common");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync,
    reloadVoieAlerts,
    reloadNumerosAlerts,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { toaster } = useContext(LayoutContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);
  const { onFusionVoie } = useFusionVoies(setIsLoading);

  const currentItem = items[currentIndex];
  const isLastItem = currentIndex >= items.length - 1;

  const isVoieNameAlert =
    currentItem?.alert.model === AlertModelEnum.VOIE &&
    isAlertVoieNom(currentItem.alert);
  const isNumeroSuffixeAlert =
    currentItem?.alert.model === AlertModelEnum.NUMERO &&
    isAlertNumeroSuffixe(currentItem.alert);
  const isNumeroParcelleAlert =
    currentItem?.alert.model === AlertModelEnum.NUMERO &&
    isAlertNumeroParcelle(currentItem.alert);
  const isVoieEmpty =
    currentItem?.alert.model === AlertModelEnum.VOIE &&
    (currentItem?.alert.codes as AlertCodeVoieEnum[]).includes(
      AlertCodeVoieEnum.VOIE_EMPTY
    );
  const isVoieDoublon =
    currentItem?.alert.model === AlertModelEnum.VOIE &&
    (currentItem?.alert.codes as AlertCodeVoieEnum[]).includes(
      AlertCodeVoieEnum.DOUBLON_VOIE_NOM
    );
  const hasRemediation =
    Boolean(currentItem?.alert.remediation) &&
    (isVoieNameAlert || isNumeroSuffixeAlert);

  const alertDefinitions = useMemo(() => {
    if (!currentItem) return [];
    return currentItem.alert.codes.map((code) => {
      if (isAlertCodeVoieEnum(code)) {
        return ta(code);
      }
      if (isAlertCodeNumeroEnum(code)) {
        return ta(code);
      }
      return code;
    });
  }, [currentItem, ta]);

  const goNext = useCallback(() => {
    if (isLastItem) {
      onFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastItem, onFinish]);

  const handleApply = useCallback(async () => {
    if (!currentItem || !hasRemediation) return;

    setIsLoading(true);
    try {
      if (isVoieNameAlert) {
        matomoTrackEvent(
          MatomoEventCategory.QUALITY,
          MatomoEventAction[MatomoEventCategory.QUALITY].CORRECT_NOM_VOIE
        );
        const applyCorrection = toaster(
          () =>
            VoiesService.updateVoie(currentItem.voie.id, {
              nom: (currentItem.alert as AlertVoie).remediation,
            }),
          t("applySuccess"),
          t("applyError")
        );
        await applyCorrection();

        const voies = await reloadVoies();
        const updatedVoie = voies.find(({ id }) => id === currentItem.voie.id);
        if (updatedVoie) {
          // RELOAD ALERTS
          reloadVoieAlerts(updatedVoie, voies);
        }
      } else if (isNumeroSuffixeAlert && currentItem.numeroId) {
        matomoTrackEvent(
          MatomoEventCategory.QUALITY,
          MatomoEventAction[MatomoEventCategory.QUALITY].CORRECT_SUFFIX_NUMERO
        );
        const applyCorrection = toaster(
          () =>
            NumerosService.updateNumero(currentItem.numeroId, {
              suffixe: (currentItem.alert as AlertNumero).remediation,
            }),
          t("suffixeSuccess"),
          t("suffixeError")
        );
        await applyCorrection();

        await reloadNumerosAlerts();
      }

      reloadTiles();
      refreshBALSync();
      // Ne pas incrémenter l'index : l'item corrigé va disparaître de la liste
      // et le suivant prendra sa place au même index.
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentItem,
    hasRemediation,
    isVoieNameAlert,
    isNumeroSuffixeAlert,
    reloadTiles,
    refreshBALSync,
    matomoTrackEvent,
    toaster,
    reloadVoies,
    reloadVoieAlerts,
    reloadNumerosAlerts,
  ]);

  const handleConvertToToponyme = useCallback(async () => {
    if (!currentItem || !isVoieEmpty) return;

    setIsLoading(true);
    try {
      matomoTrackEvent(
        MatomoEventCategory.QUALITY,
        MatomoEventAction[MatomoEventCategory.QUALITY].CONVERT_VOIE_TO_TOPONYME
      );
      const convert = toaster(
        async () => {
          await VoiesService.convertToToponyme(currentItem.voie.id);
          const voies = await reloadVoies();
          await reloadToponymes();
          await reloadParcelles();
          // RELOAD ALERTS
          reloadVoieAlerts(currentItem.voie, voies);
        },
        t("convertSuccess"),
        t("convertError")
      );
      await convert();

      reloadTiles();
      refreshBALSync();
      // Ne pas incrémenter l'index : la voie convertie va disparaître de la liste.
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentItem,
    isVoieEmpty,
    matomoTrackEvent,
    toaster,
    reloadTiles,
    refreshBALSync,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    reloadVoieAlerts,
  ]);

  const handleRemoveInvalidParcelle = useCallback(async () => {
    if (!currentItem || !isNumeroParcelleAlert || !currentItem.numeroId) return;

    setIsLoading(true);
    try {
      matomoTrackEvent(
        MatomoEventCategory.QUALITY,
        MatomoEventAction[MatomoEventCategory.QUALITY].REMOVE_INVALID_PARCELLE
      );
      const numero = await NumerosService.findNumero(currentItem.numeroId);
      const invalidParcelle = (currentItem.alert as AlertNumero).value;
      const filteredParcelles = numero.parcelles.filter(
        (p) => p !== invalidParcelle
      );

      const applyCorrection = toaster(
        () =>
          NumerosService.updateNumero(currentItem.numeroId, {
            parcelles: filteredParcelles,
          }),
        t("parcelleSuccess"),
        t("parcelleError")
      );
      await applyCorrection();

      reloadNumerosAlerts();
      reloadTiles();
      refreshBALSync();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentItem,
    isNumeroParcelleAlert,
    matomoTrackEvent,
    toaster,
    reloadNumerosAlerts,
    reloadTiles,
    refreshBALSync,
  ]);

  const handleFusionVoies = useCallback(async () => {
    if (!currentItem || !isVoieDoublon) return;

    await onFusionVoie(currentItem.voie);
  }, [currentItem, isVoieDoublon, onFusionVoie]);

  if (!currentItem) {
    return (
      <Pane
        padding={16}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size={500} marginBottom={16}>
          {t("allProcessed")}
        </Heading>
        <Button onClick={onFinish} appearance="primary">
          {t("backToList")}
        </Button>
      </Pane>
    );
  }

  return (
    <Pane display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Pane
        padding={12}
        borderBottom="muted"
        background="white"
        display="flex"
        alignItems="center"
        gap={8}
      >
        <Button
          appearance="minimal"
          iconBefore={ArrowLeftIcon}
          onClick={onClose}
          size="small"
        >
          {tc("back")}
        </Button>
        <Badge color="purple">
          {currentIndex + 1} / {items.length}
        </Badge>
      </Pane>

      {/* Content */}
      <Pane flex={1} overflowY="auto" padding={16}>
        <Heading marginBottom={8}>
          {isVoieNameAlert
            ? t("suggestionVoieName")
            : isVoieEmpty
              ? t("suggestionVoieEmpty")
              : isNumeroSuffixeAlert
                ? t("suggestionSuffixe")
                : isNumeroParcelleAlert
                  ? t("suggestionParcelle")
                  : isVoieDoublon
                    ? t("suggestionDoublon")
                    : null}
        </Heading>
        <Text is="p">
          {isVoieNameAlert || isVoieEmpty || isVoieDoublon ? (
            <>{currentItem.voie.nom}</>
          ) : isNumeroSuffixeAlert || isNumeroParcelleAlert ? (
            <>
              {(currentItem.alert as AlertNumero).numero}{" "}
              {(currentItem.alert as AlertNumero).suffixe}{" "}
              {currentItem.voie.nom}
            </>
          ) : (
            ""
          )}
        </Text>

        {/* Alert descriptions */}
        <Pane
          background={defaultTheme.colors.yellowTint}
          borderLeft={`3px solid ${defaultTheme.colors.orange500}`}
          padding={12}
          borderRadius={4}
          marginBottom={16}
          marginTop={16}
        >
          <UnorderedList>
            {isNumeroParcelleAlert ? (
              <Text>
                La parcelle &quot;{currentItem.alert.value}&quot; n&apos;existe
                pas dans le cadastre de la commune.
              </Text>
            ) : (
              alertDefinitions.map((def, i) => (
                <ListItem key={i} color={defaultTheme.colors.gray900}>
                  <Text color={defaultTheme.colors.gray900}>{def}</Text>
                </ListItem>
              ))
            )}
          </UnorderedList>
        </Pane>

        {/* Diff for voie name alerts with remediation */}
        {isVoieNameAlert && hasRemediation && (
          <AlertNameDiff
            fieldLabel={t("voieNameLabel")}
            currentItem={currentItem}
          />
        )}

        {/* Diff for numero suffix alerts with remediation */}
        {isNumeroSuffixeAlert && currentItem.alert.remediation && (
          <AlertNameDiff
            fieldLabel={t("suffixeLabel")}
            currentItem={currentItem}
            isNumeroSuffixeAlert
          />
        )}

        {/* Info for VOIE_EMPTY */}
        {isVoieEmpty && (
          <Pane
            background="tint1"
            padding={12}
            borderRadius={4}
            marginBottom={16}
          >
            <Text display="block" marginBottom={8}>
              {t("voieEmptyInfo")}
            </Text>
          </Pane>
        )}

        {/* Info for numero suffix alerts without remediation */}
        {isNumeroSuffixeAlert && !currentItem.alert.remediation && (
          <Pane
            background="tint1"
            padding={12}
            borderRadius={4}
            marginBottom={16}
          >
            <Text display="block" marginBottom={8}>
              {t("suffixeInvalidInfo", { suffixe: currentItem.alert.value })}
            </Text>
          </Pane>
        )}
      </Pane>

      {/* Action buttons - sticky bottom */}
      <Pane
        position="sticky"
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        gap={8}
        paddingY={12}
        paddingX={16}
        backgroundColor="#e6e8f0"
        borderTop="muted"
      >
        {hasRemediation && (
          <Button
            isLoading={isLoading}
            onClick={handleApply}
            appearance="primary"
            iconAfter={TickCircleIcon}
            style={{ backgroundColor: defaultTheme.colors.purple600 }}
          >
            {t("apply")}
          </Button>
        )}
        {isVoieEmpty && (
          <Button
            isLoading={isLoading}
            onClick={handleConvertToToponyme}
            appearance="primary"
            style={{ backgroundColor: defaultTheme.colors.purple600 }}
          >
            {t("convertToToponyme")}
          </Button>
        )}
        {isNumeroParcelleAlert && (
          <Button
            isLoading={isLoading}
            onClick={handleRemoveInvalidParcelle}
            appearance="primary"
            iconAfter={TickCircleIcon}
            style={{ backgroundColor: defaultTheme.colors.purple600 }}
          >
            {t("removeParcelle")}
          </Button>
        )}
        {isVoieDoublon && (
          <Button
            isLoading={isLoading}
            onClick={handleFusionVoies}
            appearance="primary"
            iconAfter={TickCircleIcon}
            style={{ backgroundColor: defaultTheme.colors.purple600 }}
          >
            {t("mergeVoies")}
          </Button>
        )}
        <Button
          disabled={isLoading}
          onClick={goNext}
          appearance="default"
          iconAfter={ChevronRightIcon}
          style={{
            color: defaultTheme.colors.purple600,
            borderColor: defaultTheme.colors.purple600,
          }}
        >
          {isLastItem ? t("finish") : t("skip")}
        </Button>
        <Button
          disabled={isLoading}
          onClick={onClose}
          appearance="minimal"
          iconBefore={CrossIcon}
        >
          {tc("cancel")}
        </Button>
      </Pane>
    </Pane>
  );
}

export default AlertsBatchProcessor;
