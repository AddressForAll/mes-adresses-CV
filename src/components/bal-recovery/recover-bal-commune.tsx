"use client";

import { useCallback, useState, useContext, useEffect } from "react";
import NextImage from "next/legacy/image";
import {
  Alert,
  Button,
  Heading,
  Pane,
  Paragraph,
  Spinner,
  Strong,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import LocalStorageContext from "@/contexts/local-storage";

import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneSearchField } from "@/components/commune-search";
import { CommuneType } from "@/types/commune";
import { hasBeenSentRecently } from "@/lib/utils/date";
import { ApiDepotService } from "@/lib/api-depot";
import CountryContext from "@/contexts/country";

interface RecoverBALCommuneProps {
  baseLocale?: BaseLocale;
  error?: string;
  isLoading?: boolean;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  onClose: () => void;
}

function RecoverBALCommune({
  baseLocale,
  error,
  isLoading,
  setError,
  setIsLoading,
  onClose,
}: RecoverBALCommuneProps) {
  const t = useTranslations("balRecovery");
  const tc = useTranslations("common");
  const { recoveryEmailCommuneSent, setRecoveryEmailCommuneSent } =
    useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const { countryProfile } = useContext(CountryContext);
  const [commune, setCommune] = useState<CommuneType | null>(null);
  const [emailsCommune, setEmailsCommune] = useState<string[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState<boolean>(false);

  const fetchEmailsCommune = useCallback(async (codeCommune: string) => {
    setIsLoadingEmails(true);
    try {
      const emails = await ApiDepotService.getEmailsCommune(codeCommune);
      setEmailsCommune(emails);
    } finally {
      setIsLoadingEmails(false);
    }
  }, []);

  const selectCommune = useCallback(
    (commune: CommuneType) => {
      setCommune(commune);
      fetchEmailsCommune(commune?.code);
    },
    [fetchEmailsCommune]
  );

  useEffect(() => {
    if (baseLocale?.id) {
      fetchEmailsCommune(baseLocale.commune);
    }
  }, [baseLocale?.id, baseLocale?.commune, fetchEmailsCommune]);

  const recoveryCommune = useCallback(async () => {
    const codeCommune = commune?.code || baseLocale?.commune;
    await BasesLocalesService.recoveryBasesLocalesByCommune({
      codeCommune,
    });
    setRecoveryEmailCommuneSent(new Date());
    pushToast({
      title: t("emailSentToCommune"),
      intent: "success",
    });
    setError(null);
  }, [
    commune?.code,
    baseLocale?.commune,
    setRecoveryEmailCommuneSent,
    pushToast,
    setError,
  ]);

  const handleConfirmCommune = useCallback(async () => {
    setIsLoading(true);

    if (hasBeenSentRecently(recoveryEmailCommuneSent)) {
      setIsLoading(false);
      onClose();
      pushToast({
        title: t("emailAlreadySent"),
        intent: "warning",
      });
      return;
    }

    try {
      await recoveryCommune();
      onClose();
    } catch (error) {
      setError(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    recoveryEmailCommuneSent,
    onClose,
    pushToast,
    recoveryCommune,
    setError,
  ]);

  return (
    <Pane
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginTop={16}
      padding={16}
      background="white"
      borderRadius={8}
    >
      <Pane>
        <Pane display="flex" justifyContent="center" marginBottom={8}>
          <NextImage
            width={66}
            height={66}
            src={"/static/images/mairie.svg"}
            alt={t("mairieLogoAlt")}
            style={{ filter: "grayscale(100%)" }}
          />
        </Pane>
        <Heading is="h2" marginBottom={8}>
          {t("byCommuneTitle")}
        </Heading>
        {!baseLocale?.id && (
          <Paragraph marginBottom={8}>{t("chooseCommune")}</Paragraph>
        )}
        {!baseLocale && countryProfile.geoApi && (
          <CommuneSearchField
            id="commune"
            required={false}
            innerRef={() => {}}
            initialSelectedItem={commune}
            label=""
            placeholder="Roche 42"
            appearance="default"
            maxWidth={500}
            onSelect={selectCommune}
          />
        )}
        {!baseLocale && !countryProfile.geoApi && (
          <Alert intent="none" hasIcon={false}>
            <Paragraph>
              {t("communeRecoveryUnavailable", {
                country: countryProfile.label,
              })}
            </Paragraph>
          </Alert>
        )}
        {error && (
          <Alert marginTop={16} intent="danger">
            {error}
          </Alert>
        )}
        {isLoadingEmails && (
          <Pane marginTop={16} display="flex" alignItems="center" gap={8}>
            <Spinner />
            <Paragraph>{t("loadingCommuneEmails")}</Paragraph>
          </Pane>
        )}
        {!isLoadingEmails && emailsCommune.length > 0 && (
          <Alert marginTop={16} intent="info" hasIcon={false}>
            <Paragraph color="blue600">
              {t.rich("emailWillBeSentTo", {
                emails: emailsCommune.join(", "),
                strong: (chunks) => <Strong>{chunks}</Strong>,
              })}
            </Paragraph>
          </Alert>
        )}
      </Pane>
      {(!baseLocale || baseLocale.status === BaseLocale.status.PUBLISHED) && (
        <Button
          marginTop={16}
          onClick={handleConfirmCommune}
          appearance="primary"
          disabled={(!Boolean(baseLocale?.id) && !commune) || isLoading}
          alignSelf="flex-end"
        >
          {isLoading ? tc("loading") : t("receiveEmail")}
        </Button>
      )}
    </Pane>
  );
}

export default RecoverBALCommune;
