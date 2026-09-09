import React, { useContext } from "react";
import { Toponyme, ToponymesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { Signalement } from "@/lib/openapi-signalement";
import { useSignalementMapDiffDeletion } from "../../hooks/useSignalementMapDiffDeletion";
import LayoutContext from "@/contexts/layout";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import BalDataContext from "@/contexts/bal-data";
import { Alert, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface SignalementDeleteToponymeProps {
  author: Signalement["author"];
  existingLocation: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementDeleteToponyme({
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementDeleteToponymeProps) {
  const t = useTranslations("signalementForm");
  const { nom, positions, parcelles } = existingLocation;
  const { pushToast } = useContext(LayoutContext);
  const { reloadToponymes } = useContext(BalDataContext);

  useSignalementMapDiffDeletion(existingLocation);

  const onAccept = async () => {
    try {
      await ToponymesService.softDeleteToponyme(existingLocation.id);
      await reloadToponymes();
      await handleAccept();
    } catch (error) {
      console.error("Error accepting signalement:", error);
      pushToast({
        title: t("acceptError"),
        intent: "danger",
      });
    }
  };

  return (
    <>
      <SignalementToponymeDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_DELETE}
        title={t("deleteToponymeRequest")}
        nom={{
          to: nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
      />
      <Alert flexShrink={0}>
        <Text>
          En acceptant ce signalement, le toponyme {nom} sera placé dans la
          corbeille
        </Text>
      </Alert>
      <SignalementFormButtons
        author={author}
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementDeleteToponyme;
