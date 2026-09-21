"use client";

import { useMemo, useState } from "react";
import { Alert, Dialog, Heading, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";

import RecoverBALCommune from "./recover-bal-commune";
import RecoverBALMail from "./recover-bal-mail";
import { BaseLocale } from "@/lib/openapi-api-bal";
import { getCountry } from "@/lib/countries";

interface RecoverBALAlertProps {
  isShown: boolean;
  defaultEmail?: string;
  baseLocale?: BaseLocale;
  onClose: () => void;
}

function RecoverBALAlert({
  isShown,
  defaultEmail,
  baseLocale,
  onClose,
}: RecoverBALAlertProps) {
  const t = useTranslations("balRecovery");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMail, setErrorMail] = useState<string | null>(null);
  const [errorCommune, setErrorCommune] = useState<string | null>(null);
  const countryProfile = baseLocale ? getCountry(baseLocale.country) : null;
  const isAccessRecoveryAvailable =
    !countryProfile || countryProfile.hasAccessRecovery;

  const handleComplete = () => {
    setIsLoading(false);
    setErrorMail(null);
    setErrorCommune(null);
    onClose();
  };

  const isDisplayCommuneRecovery = useMemo(() => {
    return !baseLocale || baseLocale.status === BaseLocale.status.PUBLISHED;
  }, [baseLocale]);

  return (
    <Dialog
      isShown={isShown}
      width={isAccessRecoveryAvailable && isDisplayCommuneRecovery ? 1000 : 500}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={() => handleComplete()}
    >
      <Pane
        background="gray300"
        marginX="-32px"
        marginY="-8px"
        borderRadius={8}
        padding={16}
      >
        <Pane background="white" borderRadius={8} padding={16}>
          <Heading is="h2" textAlign="center">
            {baseLocale ? t("recoverOneTitle") : t("recoverManyTitle")}
          </Heading>
        </Pane>
        {isAccessRecoveryAvailable ? (
          <Pane display="flex" gap={16}>
            <RecoverBALMail
              defaultEmail={defaultEmail}
              baseLocaleId={baseLocale?.id}
              error={errorMail}
              isLoading={isLoading}
              setError={setErrorMail}
              setIsLoading={setIsLoading}
              onClose={onClose}
            />
            {isDisplayCommuneRecovery && (
              <RecoverBALCommune
                baseLocale={baseLocale}
                error={errorCommune}
                isLoading={isLoading}
                setError={setErrorCommune}
                setIsLoading={setIsLoading}
                onClose={onClose}
              />
            )}
          </Pane>
        ) : (
          <Pane marginTop={16} padding={16} background="white" borderRadius={8}>
            <Alert intent="none" title={t("countryRecoveryUnavailableTitle")}>
              <Paragraph>
                {t("countryRecoveryUnavailable", {
                  country: countryProfile.label,
                })}
              </Paragraph>
            </Alert>
          </Pane>
        )}
      </Pane>
    </Dialog>
  );
}

export default RecoverBALAlert;
