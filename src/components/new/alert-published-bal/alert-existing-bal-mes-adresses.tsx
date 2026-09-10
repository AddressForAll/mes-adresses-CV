import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext } from "react";

interface AlertExistingBALMesAdressesProps {
  existingBALCount: number;
  commune: CommuneType;
}

function AlertExistingBALMesAdresses({
  existingBALCount,
  commune,
}: AlertExistingBALMesAdressesProps) {
  const t = useTranslations("alertPublishedBal");
  // The body strings were catalogued under `publishedBal`, next to the
  // other published-BAL alerts; only the title lives in `alertPublishedBal`.
  const tp = useTranslations("publishedBal");
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Alert
      title={t("existingUnpublished", { communeName: commune.nom })}
      intent="info"
      marginTop={16}
    >
      <Paragraph marginTop={8}>
        {tp.rich("existingDrafts", {
          count: existingBALCount,
          communeName: commune.nom,
          b: (chunks) => <b>{chunks}</b>,
        })}
      </Paragraph>
      <Pane marginTop={8} display="flex" gap={8}>
        <Button onClick={() => setIsRecoveryDisplayed(true)} type="button">
          {tp("recoverWithEmail")}
        </Button>
      </Pane>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
