import { Pane, Dialog } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface DeleteWarningProps {
  isShown: boolean;
  content: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isDisabled?: boolean;
}

function DeleteWarning({
  isShown,
  content,
  onCancel,
  onConfirm,
  isDisabled,
}: DeleteWarningProps) {
  const t = useTranslations("common");

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title={t("warning")}
        intent="danger"
        cancelLabel={t("cancel")}
        confirmLabel={t("delete")}
        onCloseComplete={onCancel}
        onCancel={onCancel}
        onConfirm={onConfirm}
        isConfirmLoading={isDisabled}
        isConfirmDisabled={isDisabled}
      >
        {content}
      </Dialog>
    </Pane>
  );
}

export default DeleteWarning;
