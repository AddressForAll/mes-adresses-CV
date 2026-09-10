"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Stepper from "@/components/stepper";
import SearchCommuneStep from "@/components/new/steps/search-commune-step";
import ImportDataStep, {
  ImportValue,
} from "@/components/new/steps/import-data-step";
import BALInfosStep from "@/components/new/steps/bal-infos-step";
import { Button, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LocalStorageContext from "@/contexts/local-storage";
import { useRouter } from "next/navigation";
import { useBALDataImport } from "@/hooks/bal-data-import";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import { validateEmail } from "@/lib/utils/email";
import CountryContext from "@/contexts/country";
import { getCommuneCountry } from "@/lib/countries";
import styles from "./new.module.css";

interface NewPageProps {
  defaultCommune?: CommuneType;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
}

export default function NewPageComponent({
  defaultCommune,
  outdatedApiDepotClients,
  outdatedHarvestSources,
}: NewPageProps) {
  const t = useTranslations("newBal");
  const tc = useTranslations("common");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addBalAccess } = useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const { country, countryProfile, setCountry } = useContext(CountryContext);
  const [commune, setCommune] = useState<CommuneType | null>(defaultCommune);
  const defaultImportValue: ImportValue = countryProfile.hasBanImport
    ? "ban"
    : "empty";
  const [importValue, setImportValue] =
    useState<ImportValue>(defaultImportValue);
  const [csvImportFile, setCsvImportFile] = useState<File | null>(null);
  const [balName, setBalName] = useState<string | null>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [forceDemoMode, setForceDemoMode] = useState<boolean | null>(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { importFromCSVFile, importFromBAN } = useBALDataImport();
  const router = useRouter();

  // A `/new?commune=US-…` link opens on that commune's country.
  useEffect(() => {
    if (defaultCommune?.code) {
      setCountry(getCommuneCountry(defaultCommune.code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switching country in the header restarts the flow when the chosen
  // commune belongs to the other country. The check (rather than a blanket
  // reset) matters on first load: the stored country is only read from
  // localStorage after mount, and must not wipe a `?commune=` default.
  const previousCountry = useRef(country);
  useEffect(() => {
    if (previousCountry.current === country) return;
    previousCountry.current = country;
    setImportValue(defaultImportValue);
    setCsvImportFile(null);
    if (commune && getCommuneCountry(commune.code) !== country) {
      setCommune(null);
      setCurrentStepIndex(0);
    }
    // `commune` is read, not watched: only a country change should reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, defaultImportValue]);

  useEffect(() => {
    if (commune) {
      setBalName(t("suggestedName", { communeName: commune.nom }));
    } else {
      setBalName(null);
    }
  }, [commune]);

  const steps = useMemo(() => {
    return [
      {
        label: t("steps.commune"),
        canBrowseNext: Boolean(commune),
        canBrowseBack: false,
      },
      {
        label: t("steps.import"),
        canBrowseNext:
          importValue === "file"
            ? Boolean(csvImportFile)
            : Boolean(importValue),
        canBrowseBack: !isLoading,
      },
      {
        label: t("steps.infos"),
        canBrowseNext:
          !isLoading &&
          Boolean(balName) &&
          (isDemoMode ||
            Boolean(adminEmails.length) ||
            validateEmail(newEmailInput)),
        canBrowseBack: !isLoading,
      },
    ];
  }, [
    isDemoMode,
    commune,
    importValue,
    csvImportFile,
    isLoading,
    balName,
    adminEmails,
    newEmailInput,
    t,
  ]);

  const onPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
    if (currentStepIndex === 1) {
      setCommune(null);
    }
  }, [currentStepIndex]);

  const onNextStep = useCallback(() => {
    if (currentStepIndex !== steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length]);

  const createNewBal = async (isDemo?: boolean, emails?: string[]) => {
    let bal: BaseLocale;

    setIsLoading(true);

    try {
      if (isDemo) {
        bal = await BasesLocalesService.createBaseLocaleDemo({
          commune: commune.code,
          country: getCommuneCountry(commune.code),
        });
      } else {
        bal = await BasesLocalesService.createBaseLocale({
          nom: balName,
          emails: emails ?? adminEmails,
          commune: commune.code,
          // From the territory itself, not the header selection.
          country: getCommuneCountry(commune.code),
        });
      }
    } catch {
      pushToast({
        title: tc("error"),
        message: t("createError"),
        intent: "danger",
      });
      setIsLoading(false);
      return;
    }

    addBalAccess(bal.id, bal.token);

    try {
      if (importValue === "file") {
        await importFromCSVFile(bal, csvImportFile);
      } else if (importValue === "ban") {
        await importFromBAN(bal);
      }
    } catch {
      pushToast({
        title: tc("error"),
        message: t("importError"),
        intent: "danger",
      });
      setIsLoading(false);
      return;
    }

    router.push(`/bal/${bal.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmails =
      validateEmail(newEmailInput) && !adminEmails.includes(newEmailInput)
        ? [...adminEmails, newEmailInput]
        : adminEmails;
    await createNewBal(isDemoMode, effectiveEmails);
  };

  return (
    <>
      <Pane flex={1} is="form" onSubmit={handleSubmit}>
        <Stepper
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepChange={setCurrentStepIndex}
        >
          <Pane display="flex" height="100%">
            <Pane flex={1} display="flex" flexDirection="column">
              {currentStepIndex === 0 && (
                <SearchCommuneStep
                  onCreateNewBAL={(isDemoMode?: boolean) => {
                    setForceDemoMode(Boolean(isDemoMode));
                    setIsDemoMode(Boolean(isDemoMode));
                    onNextStep();
                  }}
                  commune={commune}
                  setCommune={setCommune}
                  outdatedApiDepotClients={outdatedApiDepotClients}
                  outdatedHarvestSources={outdatedHarvestSources}
                />
              )}
              {currentStepIndex === 1 && (
                <ImportDataStep
                  commune={commune}
                  importValue={importValue}
                  setImportValue={setImportValue}
                  csvImportFile={csvImportFile}
                  setCsvImportFile={setCsvImportFile}
                />
              )}
              {currentStepIndex === 2 && (
                <BALInfosStep
                  balName={balName}
                  setBalName={setBalName}
                  adminEmails={adminEmails}
                  setAdminEmails={setAdminEmails}
                  newEmailInput={newEmailInput}
                  setNewEmailInput={setNewEmailInput}
                  isLoading={isLoading}
                  isDemoMode={isDemoMode}
                  setIsDemoMode={setIsDemoMode}
                  forceDemoMode={forceDemoMode}
                />
              )}
              {currentStepIndex !== 0 && (
                <Pane className={styles["stepper-controls"]}>
                  <Button
                    onClick={onPreviousStep}
                    disabled={!steps[currentStepIndex].canBrowseBack}
                    type="button"
                    {...(!steps[currentStepIndex].canBrowseBack && {
                      style: { visibility: "hidden" },
                    })}
                  >
                    {tc("previous")}
                  </Button>
                  <Button
                    appearance="primary"
                    onClick={(e) => {
                      currentStepIndex === steps.length - 1
                        ? handleSubmit(e)
                        : onNextStep();
                    }}
                    disabled={!steps[currentStepIndex].canBrowseNext}
                    type="button"
                  >
                    {currentStepIndex !== steps.length - 1
                      ? tc("next")
                      : isDemoMode
                        ? t("createDemoBal")
                        : t("createBal")}
                  </Button>
                </Pane>
              )}
            </Pane>
            <Pane className={styles["welcome-illustration"]} />
          </Pane>
        </Stepper>
      </Pane>
    </>
  );
}
