import React, { useContext, useState } from "react";
import { Card, Pane, PlusIcon, UndoIcon } from "evergreen-ui";
import BALRecoveryContext from "@/contexts/bal-recovery";
import ButtonCircleEffect from "../button-circle-effect";
import { useRouter } from "next/navigation";

function CreateBaseLocaleCard() {
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
        label="Créer une base adresse locale"
        onClick={handleCreateClick}
        icon={PlusIcon}
        isLoading={isNavigating}
      />
      <Pane borderTop="1px solid #E6E8F0" />
      <ButtonCircleEffect
        label="Récupérer une base adresse locale"
        onClick={() => setIsRecoveryDisplayed(true)}
        icon={UndoIcon}
      />
    </Card>
  );
}

export default CreateBaseLocaleCard;
