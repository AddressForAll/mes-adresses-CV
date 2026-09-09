"use client";

import { useContext } from "react";
import { Alert, Button, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import BALRecoveryContext from "@/contexts/bal-recovery";

function BALRecovery() {
  const t = useTranslations("balRecovery");
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Alert>
      <Text>{t("cannotFindBals")}</Text>
      <Button
        appearance="primary"
        marginLeft="1em"
        onClick={() => setIsRecoveryDisplayed(true)}
      >
        {t("clickHere")}
      </Button>
    </Alert>
  );
}

export default BALRecovery;
