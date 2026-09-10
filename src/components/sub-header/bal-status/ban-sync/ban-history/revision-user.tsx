import React from "react";
import { Pane, Text, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { HabilitationDTO, StrategyDTO } from "@/lib/openapi-api-bal";

interface RevisionUserProps {
  communeName: string;
  context: {
    nomComplet?: string;
    organisation?: string;
  };
  habilitation: HabilitationDTO;
}

function RevisionUser({
  context,
  habilitation,
  communeName,
}: RevisionUserProps) {
  const t = useTranslations("banHistory");
  let userName = context.nomComplet || context.organisation;
  if (!userName) {
    if (
      [StrategyDTO.type.EMAIL, StrategyDTO.type.PROCONNECT].includes(
        habilitation?.strategy?.type
      )
    ) {
      userName = t("townHallOf", { communeName });
    }

    if (habilitation?.strategy?.type === StrategyDTO.type.FRANCECONNECT) {
      userName = t("electedOfficial", { communeName });
    }
  }

  return (
    <Pane display="flex" gap={4}>
      <Text>{t("by")}</Text>
      {userName ? (
        <Strong>{userName}</Strong>
      ) : (
        <Text fontStyle="italic">{t("notProvided")}</Text>
      )}
    </Pane>
  );
}

export default React.memo(RevisionUser);
