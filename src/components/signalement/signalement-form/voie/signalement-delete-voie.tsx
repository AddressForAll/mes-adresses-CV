import { useContext } from "react";
import { ExtendedVoieDTO, VoiesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { Signalement } from "@/lib/openapi-signalement";
import LayoutContext from "@/contexts/layout";
import BalDataContext from "@/contexts/bal-data";
import { Alert, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";

interface SignalementDeleteVoieProps {
  author: Signalement["author"];
  existingLocation: ExtendedVoieDTO;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementDeleteVoie({
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementDeleteVoieProps) {
  const t = useTranslations("signalementForm");
  const { nom, nbNumeros } = existingLocation;
  const { pushToast } = useContext(LayoutContext);
  const { reloadVoies } = useContext(BalDataContext);

  const onAccept = async () => {
    try {
      await VoiesService.softDeleteVoie(existingLocation.id);
      await reloadVoies();
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
      <SignalementVoieDiffCard
        signalementType={Signalement.type.LOCATION_TO_DELETE}
        title={t("deleteVoieRequest")}
        nom={{
          to: nom,
        }}
      />
      <Alert intent={nbNumeros > 0 ? "warning" : "info"} flexShrink={0}>
        <Text>
          {t.rich("deleteVoieWarning", {
            voieName: nom,
            b: (chunks) => <b>{chunks}</b>,
          })}{" "}
          {nbNumeros > 0 &&
            t.rich("deleteVoieWithNumeros", {
              count: nbNumeros,
              b: (chunks) => <b>{chunks}</b>,
            })}
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

export default SignalementDeleteVoie;
