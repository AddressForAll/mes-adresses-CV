import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Alert, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import PublishedBALMesAdresses from "./published-bal-mes-adresses";

interface AlertPublishedBALMesAdressesProps {
  revision: Revision;
  commune: CommuneType;
}

function AlertPublishedBALMesAdresses({
  revision,
  commune,
}: AlertPublishedBALMesAdressesProps) {
  const t = useTranslations("alertPublishedBal");
  return (
    <Alert
      intent="success"
      hasIcon={false}
      title={
        <Pane display="flex" alignItems="center">
          <Pane position="relative" width={24} height={24}>
            <NextImage
              src="/static/images/published-bal-icon.svg"
              alt={t("publishedIconAlt")}
              width={24}
              height={24}
            />
          </Pane>
          <span style={{ marginLeft: 10 }}>{t("alreadyPublishedBadge")}</span>
        </Pane>
      }
    >
      <PublishedBALMesAdresses revision={revision} commune={commune} />
    </Alert>
  );
}

export default AlertPublishedBALMesAdresses;
