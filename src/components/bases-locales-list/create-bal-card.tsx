import React, { useContext, useState } from "react";
import { Card, Pane, PlusIcon, UndoIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";
import BALRecoveryContext from "@/contexts/bal-recovery";
import ButtonCircleEffect from "../button-circle-effect";
import { useRouter } from "next/navigation";

function CreateBaseLocaleCard() {
  const t = useTranslations("basesLocalesList");
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCreateClick = () => {
    setIsNavigating(true);
    router.push("/new");
  };

  return (
    <Card
      flexShrink={0}
      width={290}
      height={400}
      border
      elevation={2}
      margin={12}
      display="flex"
      flexDirection="column"
    >
      <ButtonCircleEffect
        label={t("createBal")}
        onClick={handleCreateClick}
        icon={PlusIcon}
        isLoading={isNavigating}
      />
      <Pane borderTop="1px solid #E6E8F0" />
      <ButtonCircleEffect
        label={t("recoverBal")}
        onClick={() => setIsRecoveryDisplayed(true)}
        icon={UndoIcon}
      />
    </Card>
  );
}

export default CreateBaseLocaleCard;
