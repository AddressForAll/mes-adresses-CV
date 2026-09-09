import { Paragraph, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";

interface PublishedBALApiDepotProps {
  revision: Revision;
  outdatedApiDepotClients: string[];
  commune: CommuneType;
}

function PublishedBALApiDepot({
  revision,
  outdatedApiDepotClients,
  commune,
}: PublishedBALApiDepotProps) {
  const t = useTranslations("publishedBal");
  const client: PublicClient = revision.client;
  const isOutdatedClient = outdatedApiDepotClients.includes(client.id);

  return (
    <>
      <Paragraph marginTop={16}>
        {t.rich("publishedBy", {
          publisher: client.chefDeFile ? client.chefDeFile : client.mandataire,
          communeName: commune.nom,
          strong: (chunks) => <Strong>{chunks}</Strong>,
        })}{" "}
        {isOutdatedClient
          ? t("outdatedClient")
          : client.chefDeFileEmail
            ? t.rich("contactChefDeFile", {
                email: client.chefDeFileEmail,
                strong: (chunks) => <Strong>{chunks}</Strong>,
              })
            : null}
      </Paragraph>
      <Paragraph marginTop={16}>{t("communeStaysCompetent")}</Paragraph>
    </>
  );
}

export default PublishedBALApiDepot;
