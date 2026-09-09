import { Report, Signalement } from "@/lib/openapi-signalement";
import { Badge } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface SignalementTypeBadgeProps {
  type: Report.type;
}

/** Colours per report type; the labels live in the `signalementTypes` namespace. */
export const signalementTypeMap = {
  [Signalement.type.LOCATION_TO_CREATE]: {
    key: "create",
    color: "teal",
    backgroundColor: "#D3F5F7",
    foregroundColor: "#0F5156",
  },
  [Signalement.type.LOCATION_TO_UPDATE]: {
    key: "update",
    color: "purple",
    backgroundColor: "#E7E4F9",
    foregroundColor: "#6E62B6",
  },
  [Signalement.type.LOCATION_TO_DELETE]: {
    key: "delete",
    color: "orange",
    backgroundColor: "#F8E3DA",
    foregroundColor: "#FFB020",
  },
  [Report.type.MISSING_ADDRESS]: {
    key: "missingAddress",
    color: "red",
    backgroundColor: "#FCDADA",
    foregroundColor: "#7D2828",
  },
};

function SignalementTypeBadge({ type }: SignalementTypeBadgeProps) {
  const t = useTranslations("signalementTypes");

  return (
    <Badge
      width="fit-content"
      size="small"
      color={signalementTypeMap[type].color as any}
    >
      {t(signalementTypeMap[type].key)}
    </Badge>
  );
}

export default SignalementTypeBadge;
