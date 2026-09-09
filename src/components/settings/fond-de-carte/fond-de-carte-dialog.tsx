import { Alert, Dialog, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";
import FondDeCarteForm from "./fond-de-carte-form";

interface FondDeCarteDialogProps {
  isShown: boolean;
  onCloseComplete: () => void;
}

export function FondDeCarteDialog({
  isShown,
  onCloseComplete,
}: FondDeCarteDialogProps) {
  const t = useTranslations("fondDeCarte");
  return (
    <Dialog
      isShown={isShown}
      title={t("addBasemapTitle")}
      hasFooter={false}
      onCloseComplete={onCloseComplete}
    >
      <Pane paddingBottom={16}>
        <Alert marginBottom={8} intent="none" title={t("howToAddTitle")}>
          {t("howToAddContent")}
        </Alert>
        <FondDeCarteForm />
      </Pane>
    </Dialog>
  );
}

export default FondDeCarteDialog;
