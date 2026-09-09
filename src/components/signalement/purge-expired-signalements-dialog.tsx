"use client";

import { Button, Dialog, Heading, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
import ProgressBar from "../progress-bar";
import LayoutContext from "@/contexts/layout";
import {
  getAllSignalements,
  getExistingLocation,
} from "@/lib/utils/signalement";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import { SignalementsService as SignalementsServiceBal } from "@/lib/openapi-api-bal";
import { Signalement } from "@/lib/openapi-signalement";
import SignalementContext from "@/contexts/signalement";

interface PurgeExpiredSignalementsDialogProps {
  baseLocale: ExtendedBaseLocaleDTO;
  isShown: boolean;
  onClose: () => void;
}

export function PurgeExpiredSignalementsDialog({
  baseLocale,
  isShown,
  onClose,
}: PurgeExpiredSignalementsDialogProps) {
  const t = useTranslations("purgeSignalements");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const { pushToast } = useContext(LayoutContext);
  const { fetchPendingSignalements } = useContext(SignalementContext);
  const [progress, setProgress] = useState(0);

  const handlePurge = async () => {
    setIsLoading(true);
    try {
      const allPendingSignalements = await getAllSignalements(
        [Signalement.status.PENDING],
        undefined,
        undefined,
        [baseLocale.commune]
      );
      const allVoies = await BasesLocalesService.findBaseLocaleVoies(
        baseLocale.id
      );
      const allToponymes = await BasesLocalesService.findBaseLocaleToponymes(
        baseLocale.id
      );
      let totalCount = 0;
      let purgedSignalementsCount = 0;

      for (const pendingSignalement of allPendingSignalements) {
        let signalementLocation = null;
        const isNewVoieCreation =
          pendingSignalement.type === Signalement.type.LOCATION_TO_CREATE &&
          pendingSignalement.existingLocation === null;

        try {
          signalementLocation = await getExistingLocation(
            pendingSignalement,
            allVoies,
            allToponymes
          );
        } catch (error) {
          console.error(
            `Error getting existing location for signalement ${pendingSignalement.id}:`,
            error
          );
        }

        if (!signalementLocation && !isNewVoieCreation) {
          await SignalementsServiceBal.updateReports(baseLocale.id, {
            ids: [pendingSignalement.id],
            status: Signalement.status.EXPIRED,
          });
          purgedSignalementsCount++;
        }
        totalCount++;
        setProgress(
          Math.round((totalCount / allPendingSignalements.length) * 100)
        );
      }

      pushToast({
        title: t("successTitle"),
        message: t("purged", { count: purgedSignalementsCount }),
        intent: "success",
      });
    } catch (error) {
      console.error("Failed to purge expired signalements:", error);
      pushToast({
        title: tc("error"),
        message: t("purgeError"),
        intent: "danger",
      });
    } finally {
      setIsLoading(false);
      onClose();
      // Refresh pending signalements count
      await fetchPendingSignalements(1);
    }
  };

  return (
    <Dialog
      isShown={isShown}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={onClose}
      {...(isLoading && {
        shouldCloseOnEscapePress: false,
        shouldCloseOnOverlayClick: false,
      })}
    >
      <Pane paddingY={16}>
        <Heading is="h4" size={600}>
          {t("title")}
        </Heading>
      </Pane>
      {isLoading ? (
        <>
          <Paragraph>{t("pleaseWait")}</Paragraph>
          <Pane marginBottom={16}>
            <ProgressBar percent={progress} />
          </Pane>
        </>
      ) : (
        <>
          <Paragraph>{t("explanation")}</Paragraph>
          <Paragraph marginTop={8}>{t("outcome")}</Paragraph>
          <Pane marginY={16} display="flex" justifyContent="flex-end">
            <Button marginRight={16} appearance="primary" onClick={handlePurge}>
              {t("refresh")}
            </Button>
            <Button appearance="default" onClick={onClose}>
              {tc("close")}
            </Button>
          </Pane>
        </>
      )}
    </Dialog>
  );
}
