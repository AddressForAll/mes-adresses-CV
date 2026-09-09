import { useCallback } from "react";
import { Dialog, Pane, Paragraph, Strong, VideoIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import { PEERTUBE_LINK } from "@/components/help/video-container";

interface MassDeletionDialogProps {
  isShown: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
  onClose: () => void;
}

function MassDeletionDialog({
  isShown,
  handleConfirm,
  handleCancel,
  onClose,
}: MassDeletionDialogProps) {
  const t = useTranslations("massDeletionDialog");
  const tc = useTranslations("common");
  const onConfirm = useCallback(() => {
    handleConfirm();
    handleCancel(); // Pass isShown to false
  }, [handleConfirm, handleCancel]);

  return (
    <Dialog
      isShown={isShown}
      intent="danger"
      title={t("title")}
      cancelLabel={tc("cancel")}
      confirmLabel={tc("continue")}
      onConfirm={onConfirm}
      onCancel={handleCancel}
      onCloseComplete={onClose}
    >
      <Pane>
        <Paragraph>
          {t.rich("deletedHalf", {
            strong: (chunks) => <Strong>{chunks}</Strong>,
          })}
        </Paragraph>
        <Paragraph marginTop={8}>
          {t.rich("wholeCommune", {
            strong: (chunks) => <Strong>{chunks}</Strong>,
          })}
        </Paragraph>

        <Paragraph marginTop={8}>
          {t.rich("contactUs", {
            strong: (chunks) => <Strong>{chunks}</Strong>,
            mail: (chunks) => (
              <a href="mailto:adresse@data.gouv.fr">{chunks}</a>
            ),
          })}
        </Paragraph>
        <Paragraph marginTop={8}>
          {t.rich("videoTutorials", {
            link: (chunks) => (
              <a href={`${PEERTUBE_LINK}/c/base_adresse_locale/videos`}>
                <VideoIcon size={12} /> {chunks}
              </a>
            ),
          })}
        </Paragraph>
      </Pane>
    </Dialog>
  );
}

export default MassDeletionDialog;
