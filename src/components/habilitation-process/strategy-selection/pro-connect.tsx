import { Pane, Strong, Link, Alert, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import styles from "./button-pro-connect.module.css";
import { useEffect, useState } from "react";
import { ApiAnnuaireService } from "@/lib/api_annuaire";
import {
  PEERTUBE_LINK,
  VideoContainer,
} from "@/components/help/video-container";

interface ProConnectProps {
  codeCommune: string;
  handleStrategy: () => void;
}

function ProConnect({ codeCommune, handleStrategy }: ProConnectProps) {
  const t = useTranslations("habilitation.proConnect");
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    async function loadEmailsMarie() {
      const emailsMarie =
        await ApiAnnuaireService.getEmailsCommune(codeCommune);
      setEmails(emailsMarie);
    }

    loadEmailsMarie();
  }, [codeCommune]);

  return (
    <>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={16}
        marginBottom={32}
      >
        <button
          className={styles["proconnect-button"]}
          style={{ cursor: "pointer" }}
          onClick={handleStrategy}
        >
          <span className={styles["proconnect-sr-only"]}>{t("signIn")}</span>
        </button>
      </Pane>
      <Alert intent="info" marginBottom={16}>
        <Paragraph marginBottom={16}>
          <Strong>{t("tagline")}</Strong>
        </Paragraph>
        <Paragraph>
          {t.rich("connectWith", {
            strong: (chunks) => <Strong>{chunks}</Strong>,
            emails: () =>
              emails.length > 0 ? <Strong>{emails.join(", ")} </Strong> : null,
            link: (chunks) => (
              <Link href="https://service-public.gouv.fr" target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </Paragraph>
        <Paragraph>{t("sameDomain")}</Paragraph>
        <Paragraph marginTop={16}>
          {t.rich("questions", {
            strong: (chunks) => <Strong>{chunks}</Strong>,
            link: () => (
              <Link href="mailto:adresse@data.gouv.fr">
                adresse@data.gouv.fr
              </Link>
            ),
          })}
        </Paragraph>
      </Alert>
      <iframe
        title={t("videoTitle")}
        src={`${PEERTUBE_LINK}/videos/embed/iojCiUnSuc29dq5a1bUPVy`}
        // https://tube.numerique.gouv.fr/videos/embed/iojCiUnSuc29dq5a1bUPVy
        height="315px"
        width="100%"
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts allow-popups"
        allowFullScreen
        style={{ borderRadius: "8px" }}
      />
    </>
  );
}

export default ProConnect;
