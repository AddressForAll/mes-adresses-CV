import {
  Button,
  Heading,
  Pane,
  Paragraph,
  Strong,
  defaultTheme,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import Confetti from "react-confetti";
import style from "./animation-achievement.module.css";
import AchievementBadge from "@/components/bal/panel-goal/achievements-badge/achievements-badge";
import { useEffect, useState } from "react";
import { CommuneType } from "@/types/commune";

interface PublishedBalStepProps {
  commune: CommuneType;
  handleClose: () => void;
  dialogWidth: number;
}

function PublishedBalStep({
  commune,
  handleClose,
  dialogWidth,
}: PublishedBalStepProps) {
  const t = useTranslations("habilitation.publishedBal");
  const [displayTitle, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 1000);
  }, []);

  return (
    <>
      <Confetti
        className="confetti"
        recycle={false}
        numberOfPieces={500}
        tweenDuration={1}
        width={dialogWidth}
        style={{
          position: "absolute",
        }}
      />
      <Pane display="flex" flexDirection="column" gap={16}>
        <Pane
          background="white"
          paddingY={32}
          paddingX={16}
          borderRadius={8}
          height={128}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={32}
        >
          {displayTitle && (
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title={t("badgeTitle")}
              completed={true}
              width={64}
              height={64}
              className={style.tada}
            />
          )}
          {displayTitle && (
            <Heading
              is="h2"
              textAlign="center"
              size={600}
              className={style.slideInRight}
              color={defaultTheme.colors.green700}
            >
              {t("title")}
            </Heading>
          )}
        </Pane>

        <Pane background="white" padding={24} borderRadius={8}>
          <Heading is="h3" marginBottom={8}>
            {t("thanksToPublication")}
          </Heading>
          <Paragraph is="li" marginBottom={8}>
            {t.rich("benefit1", {
              strong: (chunks) => <Strong>{chunks}</Strong>,
              link: (chunks) => (
                <a
                  href={`https://adresse.data.gouv.fr/commune/${commune.code}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            {t.rich("benefit2", {
              link: (chunks) => (
                <a
                  href="https://guide-bonnes-pratiques.adresse.data.gouv.fr/transmettre-les-informations-a-la-base-adresse-nationale/le-coeur-de-linformation-legale"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            {t.rich("benefit3", {
              strong: (chunks) => <Strong>{chunks}</Strong>,
            })}
          </Paragraph>
          <Paragraph is="li" marginBottom={16}>
            {t.rich("benefit4", {
              strong: (chunks) => <Strong>{chunks}</Strong>,
            })}
          </Paragraph>
          <Heading is="h3" marginBottom={8}>
            {t("nextGoal")}
          </Heading>
          <Paragraph>
            {t.rich("nextGoalContent", {
              strong: (chunks) => <Strong>{chunks}</Strong>,
              link: (chunks) => (
                <a
                  href="https://guide.mes-adresses.data.gouv.fr/publier-une-base-adresse-locale-1/certifier-ses-adresses"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
          <Button intent="primary" appearance="primary" onClick={handleClose}>
            {t("continue")}
          </Button>
        </Pane>
      </Pane>
    </>
  );
}

export default PublishedBalStep;
