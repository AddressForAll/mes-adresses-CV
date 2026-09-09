import { useMemo, useState, useContext } from "react";
import NextLink from "next/link";
import {
  Pane,
  Heading,
  Button,
  Paragraph,
  defaultTheme,
  Strong,
  Text,
  Link,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import usePublishProcess from "@/hooks/publish-process";
import { CommuneType } from "@/types/commune";
import { ExtendedBaseLocaleDTO, HabilitationDTO } from "@/lib/openapi-api-bal";
import AchievementBadge from "../achievements-badge/achievements-badge";
import { AccordionCard } from "@/components/accordion-card";
import BalDataContext from "@/contexts/bal-data";
import BALRecoveryContext from "@/contexts/bal-recovery";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface PublicationGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PublicationGoal({ commune, baseLocale }: PublicationGoalProps) {
  const t = useTranslations("publicationGoal");
  const { handleShowHabilitationProcess } = usePublishProcess(commune);
  const { habilitation } = useContext(BalDataContext);
  const [isActive, setIsActive] = useState(
    baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT
  );
  const { otherBalIdPublished } = useContext(BALRecoveryContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const handlePublication = (e) => {
    e.stopPropagation();
    matomoTrackEvent(
      MatomoEventCategory.HABILITATION,
      MatomoEventAction[MatomoEventCategory.HABILITATION].OPEN_HABILITATION
    );
    handleShowHabilitationProcess();
  };
  const isCompleted = useMemo(() => {
    return (
      baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
      habilitation?.status === HabilitationDTO.status.ACCEPTED
    );
  }, [baseLocale.status, habilitation?.status]);

  const colorCard = useMemo(() => {
    if (baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED) {
      return defaultTheme.colors.redTint;
    } else if (baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED) {
      if (habilitation?.status === HabilitationDTO.status.ACCEPTED) {
        return defaultTheme.colors.green100;
      } else {
        return defaultTheme.colors.yellow100;
      }
    }
    return defaultTheme.colors.white;
  }, [baseLocale.status, habilitation?.status]);

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane display="flex" alignItems="center" gap={16} paddingLeft={8}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title={t("badgeTitle")}
              completed={isCompleted}
            />
            <Heading color={isCompleted && defaultTheme.colors.green700}>
              {t("title")}
            </Heading>
          </Pane>
        }
        backgroundColor={colorCard}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          {Boolean(otherBalIdPublished) && (
            <Pane>
              <Text is="p">{t("mustStartFromPublished")}</Text>
              <Button
                height={30}
                marginTop={8}
                is={NextLink}
                href={`/bal/${otherBalIdPublished}`}
              >
                {t("goToPublished")}
              </Button>
              <Text is="p" marginTop={24}>
                {t("contactSupport")}{" "}
                <Link href="mailto:adresse@data.gouv.fr">
                  adresse@data.gouv.fr
                </Link>
              </Text>
            </Pane>
          )}
          {!Boolean(otherBalIdPublished) &&
            baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT && (
              <Paragraph is="div">
                {t.rich("draftContent", {
                  communeName: commune.nom,
                  strong: (chunks) => <Strong>{chunks}</Strong>,
                  br: () => <br />,
                })}
                <Pane display="flex" justifyContent="right">
                  <Button
                    appearance="primary"
                    onClick={(e) => handlePublication(e)}
                    textAlign="center"
                  >
                    {t("publish")}
                  </Button>
                </Pane>
              </Paragraph>
            )}
          {!Boolean(otherBalIdPublished) &&
            baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation?.status === HabilitationDTO.status.ACCEPTED && (
              <Paragraph>{t("publishedContent")}</Paragraph>
            )}
          {!Boolean(otherBalIdPublished) &&
            baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation?.status !== HabilitationDTO.status.ACCEPTED && (
              <Paragraph display="flex" flexDirection="column" gap={8} is="div">
                {t("habilitationExpired")}
                <Pane display="flex" justifyContent="right">
                  <Button
                    marginRight={8}
                    height={24}
                    appearance="primary"
                    onClick={handleShowHabilitationProcess}
                  >
                    {t("habiliteBal")}
                  </Button>
                </Pane>
              </Paragraph>
            )}
          {!Boolean(otherBalIdPublished) &&
            baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED && (
              <Pane>
                <Paragraph color={defaultTheme.colors.red700}>
                  {t("replacedContent")}
                </Paragraph>
                <Paragraph>{t("replacedContact")}</Paragraph>
              </Pane>
            )}
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default PublicationGoal;
