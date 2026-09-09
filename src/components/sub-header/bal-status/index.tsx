import { useContext, useEffect, useState } from "react";
import { Pane, Button, toaster } from "evergreen-ui";
import { useTranslations } from "next-intl";

import usePublishProcess from "@/hooks/publish-process";

import StatusBadge from "@/components/status-badge";
import BANSync from "@/components/sub-header/bal-status/ban-sync";
import RefreshSyncBadge from "@/components/sub-header/bal-status/refresh-sync-badge";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import BALRecoveryContext from "@/contexts/bal-recovery";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface BALStatusProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  token: string;
  habilitation: HabilitationDTO;
  isRefrehSyncStat: boolean;
  handlePublication: () => Promise<any>;
  handleHabilitation: () => Promise<void>;
  reloadBaseLocale: () => void;
}

function BALStatus({
  baseLocale,
  commune,
  token = null,
  habilitation,
  isRefrehSyncStat,
  handlePublication,
  handleHabilitation,
  reloadBaseLocale,
}: BALStatusProps) {
  const t = useTranslations("balStatusActions");
  const [isHabilitationValid, setIsHabilitationValid] = useState<
    boolean | null
  >(null);
  const { otherBalIdPublished } = useContext(BALRecoveryContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  useEffect(() => {
    async function checkHabilitationValid() {
      const result = await HabilitationService.findIsValid(baseLocale.id);
      setIsHabilitationValid(result);
    }
    if (habilitation) {
      setIsHabilitationValid(
        habilitation?.status === HabilitationDTO.status.ACCEPTED
      );
    } else {
      checkHabilitationValid();
    }
  }, [habilitation, baseLocale.id]);

  const handleShowHabilitation = (e) => {
    e.stopPropagation();
    matomoTrackEvent(
      MatomoEventCategory.HABILITATION,
      MatomoEventAction[MatomoEventCategory.HABILITATION].OPEN_HABILITATION
    );
    handleHabilitation();
  };

  const handlePause = async () => {
    try {
      await BasesLocalesService.pauseBaseLocale(baseLocale.id);
      toaster.success(t("pauseSuccess"));
    } catch (error: unknown) {
      toaster.danger(t("pauseError"), {
        description: (error as any).body.message,
      });
    }
    await reloadBaseLocale();
  };

  const handleResumeSync = async () => {
    try {
      await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      toaster.success(t("resumeSuccess"));
    } catch (error: unknown) {
      toaster.danger(t("resumeError"), {
        description: (error as any).body.message,
      });
    }
    await reloadBaseLocale();
  };

  return (
    <>
      <Pane height={28} marginRight={8} flexShrink={0}>
        {isRefrehSyncStat ? (
          <RefreshSyncBadge />
        ) : (
          <StatusBadge
            status={baseLocale.status}
            sync={baseLocale.sync}
            isHabilitationValid={isHabilitationValid}
          />
        )}
      </Pane>

      {Boolean(token) &&
        !Boolean(otherBalIdPublished) &&
        (baseLocale.sync && isHabilitationValid ? (
          <BANSync
            baseLocale={baseLocale}
            commune={commune}
            handleSync={handlePublication}
            togglePause={
              baseLocale.sync.isPaused ? handleResumeSync : handlePause
            }
            isHabilitationValid={isHabilitationValid}
          />
        ) : (
          <>
            {(baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED ||
              baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED) &&
              !isHabilitationValid && (
                <Button
                  marginRight={8}
                  height={24}
                  appearance="primary"
                  onClick={handleShowHabilitation}
                >
                  {t("habiliteBal")}
                </Button>
              )}
            {baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT && (
              <Button
                marginRight={8}
                height={24}
                appearance="primary"
                onClick={handleShowHabilitation}
              >
                Publier
              </Button>
            )}
          </>
        ))}
    </>
  );
}

export default BALStatus;
