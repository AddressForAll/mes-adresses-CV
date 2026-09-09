import LocalStorageContext from "@/contexts/local-storage";
import { GenerateCertificatDTO } from "@/lib/openapi-api-bal";
import {
  Dialog,
  Pane,
  TextInputField,
  Checkbox,
  RadioGroup,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./document-generation.types";

export type CertificatGenerationData = GenerateCertificatDTO & {
  rememberEmetteur?: boolean;
  format?: "pdf" | "docx";
};

interface GenerateCertificatDialogProps<type extends GeneratedDocumentType> {
  data: DocumentGenerationData<type> | null;
  setData: Dispatch<SetStateAction<DocumentGenerationData<type> | null>>;
  onDownload: (
    numeroId: string,
    data: CertificatGenerationData
  ) => Promise<void>;
}

export function GenerateCertificatDialog<type extends GeneratedDocumentType>({
  data: docData,
  setData,
  onDownload,
}: GenerateCertificatDialogProps<type>) {
  const t = useTranslations("documentGeneration");
  const tc = useTranslations("common");
  const { data } =
    (docData as DocumentGenerationData<GeneratedDocumentType.CERTIFICAT_ADRESSAGE>) ||
    {};
  const [isGeneratingCertificat, setIsGeneratingCertificat] = useState(false);
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const { setCertificatEmetteur } = useContext(LocalStorageContext);

  return (
    <Dialog
      isShown={docData?.type === GeneratedDocumentType.CERTIFICAT_ADRESSAGE}
      title={t("certificatDialogTitle")}
      cancelLabel={tc("cancel")}
      confirmLabel={t("download")}
      onCloseComplete={() => setData(null)}
      onCancel={() => setData(null)}
      isConfirmLoading={isGeneratingCertificat}
      isConfirmDisabled={isGeneratingCertificat}
      shouldCloseOnOverlayClick={!isGeneratingCertificat}
      shouldCloseOnEscapePress={!isGeneratingCertificat}
      hasCancel={!isGeneratingCertificat}
      hasClose={!isGeneratingCertificat}
      onConfirm={async () => {
        if (data) {
          setIsGeneratingCertificat(true);
          await onDownload(docData.for.id, { ...data, format });
          if (data.rememberEmetteur) {
            setCertificatEmetteur(data.emetteur);
          } else {
            setCertificatEmetteur(undefined);
          }
          setIsGeneratingCertificat(false);
          setData(null);
        }
      }}
    >
      <Pane is="form" onSubmit={(e) => e.preventDefault()}>
        <TextInputField
          label={t("emetteurLabel")}
          description={t("emetteurDescription")}
          value={data?.emetteur || ""}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              data: {
                ...data.data,
                emetteur: e.target.value,
              },
            }))
          }
          placeholder={t("emetteurPlaceholder")}
        />
        <Checkbox
          label={t("rememberEmetteur")}
          checked={data?.rememberEmetteur || false}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              data: {
                ...data.data,
                rememberEmetteur: (e.target as HTMLInputElement).checked,
              },
            }))
          }
          marginBottom={16}
        />
        <TextInputField
          label={t("destinataireLabel")}
          description={t("destinataireDescription")}
          value={data?.destinataire || ""}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              data: {
                ...data.data,
                destinataire: e.target.value,
              },
            }))
          }
          placeholder={t("destinatairePlaceholder")}
        />
        <RadioGroup
          label={t("format")}
          value={format}
          options={[
            { label: ".pdf", value: "pdf" },
            { label: ".docx", value: "docx" },
          ]}
          onChange={(event) => setFormat(event.target.value as "pdf" | "docx")}
        />
      </Pane>
    </Dialog>
  );
}
