import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { Alert, ArrowRightIcon, Button, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import NextLink from "next/link";

interface AlertExistingBALMesAdressesProps {
  existingBALCount: number;
  existingBALs: ExtendedBaseLocaleDTO[];
  commune: CommuneType;
}

function AlertExistingBALMesAdresses({
  existingBALCount,
  existingBALs,
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
      <Pane marginTop={8} display="flex" flexWrap="wrap" gap={8}>
        {existingBALs.map((baseLocale) => (
          <Button
            key={baseLocale.id}
            is={NextLink}
            href={`/bal/${baseLocale.id}`}
            iconAfter={ArrowRightIcon}
          >
            {tp("viewExisting", { name: baseLocale.nom })}
          </Button>
        ))}
        <Button onClick={() => setIsRecoveryDisplayed(true)} type="button">
          {tp("recoverWithEmail")}
        </Button>
      </Pane>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
