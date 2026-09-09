import Uploader from "@/components/uploader";
import { getFileExtension } from "@/lib/utils/file";
import { CommuneType } from "@/types/commune";
import {
  validate,
  ValidateType,
  ValidateRowFullType,
} from "@ban-team/validateur-bal";
import { Alert, Pane, Paragraph, Radio, Strong, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { Fragment, JSX, useState } from "react";
import { uniqBy } from "lodash";

interface ImportDataStepProps {
  commune: CommuneType;
  importValue: string;
  setImportValue: (value: "ban" | "file") => void;
  csvImportFile: File | null;
  setCsvImportFile: (file: File | null) => void;
}

type CommuneRow = {
  code: string;
  nom: string;
};

function extractCommuneCodeFromRow({ parsedValues, additionalValues }): string {
  return (
    parsedValues.commune_insee || additionalValues?.cle_interop?.codeCommune
  );
}

function extractCommuneFromCSV(rows: ValidateRowFullType[]): CommuneRow[] {
  // Get cle_interop and slice it to get the commune's code
  const communes: CommuneRow[] = rows.map(
    ({ parsedValues, additionalValues }) => ({
      code: extractCommuneCodeFromRow({ parsedValues, additionalValues }),
      nom: parsedValues.commune_nom as string,
    })
  );

  return uniqBy(communes, "code");
}

const MAX_SIZE = 10 * 1024 * 1024;

function ImportDataStep({
  importValue,
  setImportValue,
  csvImportFile,
  setCsvImportFile,
  commune,
}: ImportDataStepProps) {
  const t = useTranslations("importDataStep");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  // Built inside the component so the labels go through the catalog.
  const options = [
    {
      label: t("banOption.label"),
      value: "ban",
      description: t("banOption.description"),
    },
    {
      label: t("fileOption.label"),
      value: "file",
      description: t("fileOption.description"),
    },
  ];

  const onAlert = (alert: JSX.Element, canCreateBAL?: boolean) => {
    if (!canCreateBAL) {
      setCsvImportFile(null);
    }
    setAlert(alert);
  };

  const onDrop = async ([file]) => {
    setAlert(null);
    if (file) {
      if (getFileExtension(file.name).toLowerCase() !== "csv") {
        return onAlert(
          <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
            {t("notCsv")}
          </Alert>
        );
      }

      try {
        setIsLoading(true);
        // Detect multi communes
        const validationReport: ValidateType = (await validate(file, {
          profile: "1.4",
        })) as ValidateType;
        const communes: CommuneRow[] = extractCommuneFromCSV(
          validationReport.rows
        );
        const invalidRowsCount = validationReport.rows.filter(
          (row) =>
            !row.isValid && extractCommuneCodeFromRow(row) === commune.code
        ).length;

        if (communes.length === 1 && communes[0].code === commune.code) {
          setCsvImportFile(file);
        } else if (communes.length === 1 && communes[0].code !== commune.code) {
          onAlert(
            <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
              {t("wrongCommune")}
            </Alert>
          );
        } else if (communes.length > 1) {
          onAlert(
            <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
              {t("multipleCommunes")}
            </Alert>
          );
        } else {
          onAlert(
            <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
              {t("noCommuneFound")}
            </Alert>
          );
        }

        if (invalidRowsCount > 0) {
          onAlert(
            <Alert
              title={t("fileHasErrorsTitle")}
              intent="warning"
              marginTop={16}
            >
              <Paragraph marginTop={8}>
                {t.rich("invalidRows", {
                  count: invalidRowsCount,
                  strong: (chunks) => <Strong>{chunks}</Strong>,
                })}
              </Paragraph>

              <Paragraph>{t("onlyValidRows")}</Paragraph>
            </Alert>,
            true
          );
        }
      } catch (err) {
        console.error(err);
        onAlert(
          <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
            {t("parseError")}
          </Alert>
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onDropRejected = (rejectedFiles) => {
    const [file] = rejectedFiles;

    if (rejectedFiles.length > 1) {
      onAlert(
        <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
          {t("singleFileOnly")}
        </Alert>
      );
    } else if (file.size > MAX_SIZE) {
      return onAlert(
        <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
          {t("fileTooLarge")}
        </Alert>
      );
    } else {
      onAlert(
        <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
          {t("cannotDropFile")}
        </Alert>
      );
    }
  };

  const description = options.find(
    (option) => option.value === importValue
  )?.description;

  return (
    <>
      <Pane aria-label={t("chooseStartingPoint")} role="group">
        <Text fontWeight={500} fontSize="14px" color="gray700">
          {t("chooseStartingPoint")}
        </Text>
        {options.map((option) => (
          <Fragment key={option.value}>
            <Radio
              size={16}
              name="import-option"
              checked={importValue === option.value}
              label={option.label}
              onChange={() => setImportValue(option.value as "ban" | "file")}
            />
            {importValue === option.value && (
              <Alert intent="info" marginBottom={16}>
                <Text>{description}</Text>
              </Alert>
            )}
          </Fragment>
        ))}
      </Pane>

      {importValue === "file" && (
        <Pane>
          <Uploader
            file={csvImportFile}
            maxSize={MAX_SIZE}
            height={150}
            marginBottom={24}
            placeholder={t("uploaderPlaceholder")}
            loadingLabel={t("analysing")}
            disabled={isLoading}
            onDrop={onDrop}
            onDropRejected={onDropRejected}
            isLoading={isLoading}
          />
          {alert}
        </Pane>
      )}
    </>
  );
}

export default ImportDataStep;
