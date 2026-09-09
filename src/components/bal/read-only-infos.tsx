import React from "react";
import { Pane, Alert, Text, Button } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface BALReadOnlyProps {
  openRecoveryDialog: () => void;
}

function BALReadOnly({ openRecoveryDialog }: BALReadOnlyProps) {
  const t = useTranslations("readOnlyInfos");

  return (
    <Pane backgroundColor="white" padding={8}>
      <Alert intent="warning" title={t("title")}>
        <Text is="p">{t("cannotEdit")}</Text>
        <Text is="p">{t("recoverHint")}</Text>
        <Button appearance="primary" onClick={openRecoveryDialog}>
          {t("recoverAccess")}
        </Button>
      </Alert>
    </Pane>
  );
}

export default BALReadOnly;
