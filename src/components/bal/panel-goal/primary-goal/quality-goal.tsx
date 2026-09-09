import { useContext, useMemo } from "react";
import {
  Pane,
  Heading,
  Text,
  Button,
  EyeOpenIcon,
  defaultTheme,
  Link,
  MenuIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import { AccordionCard } from "@/components/accordion-card";
import { useState } from "react";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";
import AlertsContext from "@/contexts/alerts";
import { useRouter } from "next/navigation";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import DrawerContext from "@/contexts/drawer";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface QualityGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function QualityGoal({ baseLocale }: QualityGoalProps) {
  const t = useTranslations("qualityGoal");
  const { isMobile } = useContext(LayoutContext);
  const { setDrawerDisplayed } = useContext(DrawerContext);
  const [isActive, setIsActive] = useState(false);
  const { voiesAlerts, numerosAlerts } = useContext(AlertsContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);
  const router = useRouter();

  const goToAlerts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    matomoTrackEvent(
      MatomoEventCategory.QUALITY,
      MatomoEventAction[MatomoEventCategory.QUALITY].SEE_ALL_SUGGESTIONS
    );
    void router.push(`/bal/${baseLocale.id}/voies?filter=with-suggestions`);
  };

  const nbAlerts = useMemo(() => {
    const nbVoiesAlerts =
      Object.values(voiesAlerts)?.reduce(
        (acc, current) => acc + current.length,
        0
      ) || 0;
    const nbNumerosAlerts =
      Object.values(numerosAlerts)?.reduce(
        (acc, current) => acc + current.length,
        0
      ) || 0;
    return nbVoiesAlerts + nbNumerosAlerts;
  }, [voiesAlerts, numerosAlerts]);

  const isAllCorrected = useMemo(() => {
    return nbAlerts === 0;
  }, [nbAlerts]);

  const colorCard = useMemo(() => {
    if (nbAlerts === 0) {
      return defaultTheme.colors.green100;
    }
    return defaultTheme.colors.white;
  }, [nbAlerts]);

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/fiabilite.svg"
                title={t("badgeTitle")}
                completed={isAllCorrected}
              />
              <Heading color={isAllCorrected && "#317159"}>
                {t("title")}
              </Heading>
            </Pane>

            {nbAlerts > 0 ? (
              <Pane
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Counter
                  label={t("suggestionsLabel", { count: nbAlerts })}
                  value={nbAlerts}
                  color={defaultTheme.colors.purple600}
                />

                <Button
                  width="100%"
                  style={{
                    backgroundColor: defaultTheme.colors.purple600,
                    color: "white",
                  }}
                  iconAfter={EyeOpenIcon}
                  title={t("seeAlertsTitle")}
                  onClick={(e) => goToAlerts(e)}
                >
                  {t("seeSuggestions")}
                </Button>
              </Pane>
            ) : null}
          </Pane>
        }
        backgroundColor={colorCard}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8} marginBottom={16}>
          <Text>
            {t.rich("explanation", {
              br: () => <br />,
              link: (chunks) => (
                <Link
                  target="_blank"
                  href="https://doc.adresse.data.gouv.fr/docs/bonnes-pratiques/a-propos-du-guide-des-bonnes-pratiques"
                >
                  {chunks}
                </Link>
              ),
              menuButton: (chunks) => (
                <Button
                  onClick={() => setDrawerDisplayed(true)}
                  {...(!isMobile && {
                    iconAfter: MenuIcon,
                    marginRight: 16,
                    height: 24,
                  })}
                >
                  {isMobile ? <MenuIcon /> : chunks}
                </Button>
              ),
            })}
          </Text>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default QualityGoal;
