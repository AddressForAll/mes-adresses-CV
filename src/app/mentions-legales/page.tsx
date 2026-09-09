"use client";

import { Pane, Heading, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import useWindowSize from "@/hooks/useWindowSize";

export default function MentionsLegales() {
  const t = useTranslations("legalNotice");
  const { isMobile } = useWindowSize();

  return (
    <>
      <Pane
        fontSize={18}
        {...(isMobile
          ? { padding: 20 }
          : {
              padding: 20,
              marginX: "6em",
              marginY: "2em",
            })}
      >
        <Heading is="h1" fontSize={24} marginBottom={30}>
          {t("title")}
        </Heading>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("publisher")}
          </Heading>

          <Paragraph>{t("publisherContent")}</Paragraph>
          <Pane marginTop="15px">
            <Paragraph>20 avenue de Ségur</Paragraph>
            <Paragraph>75007 Paris</Paragraph>
            <Paragraph>France</Paragraph>

            <Paragraph marginTop="15px">
              {t("phone", { number: "01 85 58 60 00" })}
            </Paragraph>
          </Pane>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("publicationDirector")}
          </Heading>

          <Paragraph>{t("publicationDirectorContent")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("hosting")}
          </Heading>

          <Paragraph>{t("hostingContent")}</Paragraph>

          <Pane marginTop="15px">
            <Paragraph>Scalingo SAS</Paragraph>
            <Paragraph>13 rue Jacques Peirotes</Paragraph>
            <Paragraph>67000 Strasbourg</Paragraph>
            <Paragraph>France</Paragraph>

            <Paragraph marginTop="15px">SIRET 80866548300018</Paragraph>
          </Pane>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("accessibility")}
          </Heading>

          <Paragraph>{t("accessibilityContent")}</Paragraph>

          <Heading is="h3" fontSize={18} marginBottom={10} marginTop={10}>
            {t("learnMore")}
          </Heading>

          <Paragraph>
            {t("learnMoreContent")}{" "}
            <a target="_blank" href="https://accessibilite.numerique.gouv.fr/">
              https://accessibilite.numerique.gouv.fr/
            </a>
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("reportIssue")}
          </Heading>

          <Paragraph>
            {t("reportIssueContent")}{" "}
            <a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>
          </Paragraph>

          <Paragraph>{t("noResponseContent")}</Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            {t("security")}
          </Heading>

          <Paragraph>{t("securityContent1")}</Paragraph>

          <Paragraph>{t("securityContent2")}</Paragraph>
        </Pane>
      </Pane>
    </>
  );
}
