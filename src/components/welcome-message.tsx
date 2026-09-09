"use client";

import { useState, useEffect, useContext } from "react";
import {
  Pane,
  Dialog,
  Paragraph,
  Heading,
  CrossIcon,
  Icon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import CommuneFlag from "./commune-flag";
import { CommuneType } from "@/types/commune";
import { AchievementBadge } from "./bal/panel-goal/achievements-badge/achievements-badge";
import MiniCard from "./mini-card";
import LocalStorageContext from "@/contexts/local-storage";

function WelcomeMessage({ commune }: { commune: CommuneType }) {
  const t = useTranslations("welcomeMessage");
  const { wasWelcomed, setWasWelcomed } = useContext(LocalStorageContext);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setIsShown(!wasWelcomed);
  }, [wasWelcomed]);

  return (
    <Dialog
      isShown={isShown}
      intent="success"
      header={
        <Pane position="relative" width="100%">
          <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading textAlign="center">
              <CommuneFlag codeCommune={commune.code} />
            </Heading>
            <Heading>{t("title", { communeName: commune.nom })}</Heading>
          </Pane>
          <Icon
            icon={CrossIcon}
            cursor="pointer"
            position="absolute"
            right={0}
            top={0}
            onClick={() => setWasWelcomed(true)}
          />
        </Pane>
      }
      confirmLabel={t("start")}
      hasCancel={false}
      onConfirm={() => setWasWelcomed(true)}
      onCloseComplete={() => setWasWelcomed(true)}
    >
      <Pane>
        <Pane marginTop={16} display="flex" flexDirection="row">
          <Pane marginRight={32}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title={t("publicationBadge")}
              completed={true}
              width={64}
              height={64}
            />
          </Pane>
          <Pane>
            <Heading>
              {t.rich("startWithPublication", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </Heading>
            <Paragraph marginY={16}>
              {t("officialSource", { communeName: commune.nom })}
            </Paragraph>
          </Pane>
        </Pane>
        <br />
        <Pane display="flex" flexDirection="row">
          <Pane>
            <Heading>{t("ownPaceTitle")}</Heading>
            <Paragraph marginY={16}>
              {t.rich("ownPaceContent", { br: () => <br /> })}
            </Paragraph>
          </Pane>
        </Pane>

        <Pane marginY={16}>
          <Heading marginBottom={16}>{t("needHelp")}</Heading>
          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <MiniCard
              img="/static/images/education.png"
              message={t("training")}
              href="https://adresse.data.gouv.fr/formation-en-ligne"
            />
            <MiniCard
              img="/static/images/video-call.png"
              message={t("tutorials")}
              href="https://tube.numerique.gouv.fr/w/p/cm6YcSnDdztzRjKTH3vNFn?playlistPosition=1"
            />
            <MiniCard
              img="/static/images/manual.png"
              message={t("guides")}
              href="https://adresse.data.gouv.fr/documentation-bal"
            />
          </Pane>
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default WelcomeMessage;
