import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { ExistingToponyme, Signalement } from "@/lib/openapi-signalement";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";
import { useSignalementMapDiffDeletion } from "../../hooks/useSignalementMapDiffDeletion";

interface SignalementViewerUpdateToponymeProps {
  signalement: Signalement;
}

function SignalementViewerUpdateToponyme({
  signalement,
}: SignalementViewerUpdateToponymeProps) {
  const tv = useTranslations("signalementViewer");
  const { existingLocation, status } = signalement;

  const { nom, position, parcelles } = existingLocation as ExistingToponyme;

  const mapDiffLocation = useMemo(
    () => ({ parcelles, positions: [position] }),
    [parcelles, position]
  );

  useSignalementMapDiffDeletion(mapDiffLocation);

  return (
    <SignalementToponymeDiffCard
      title={
        <>
          {tv("deleteToponyme", {
            status:
              status === Signalement.status.PROCESSED ? "accepted" : "rejected",
          })}
          {status === Signalement.status.PROCESSED ? (
            <TickCircleIcon size={20} color="success" marginLeft={10} />
          ) : (
            <BanCircleIcon size={20} color="danger" marginLeft={10} />
          )}
        </>
      }
      isActive
      signalementType={Signalement.type.LOCATION_TO_DELETE}
      nom={{
        to: nom,
      }}
      positions={{
        to: [position],
      }}
      parcelles={{
        to: parcelles,
      }}
    />
  );
}

export default SignalementViewerUpdateToponyme;
