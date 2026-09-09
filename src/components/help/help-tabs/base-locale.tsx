import {
  Pane,
  OrderedList,
  ListItem,
  Button,
  Strong,
  Paragraph,
  Tab,
  CogIcon,
  PlusIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import BALRecovery from "@/components/bal-recovery/bal-recovery";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function BaseLocale() {
  const t = useTranslations("help.baseLocale");

  // Inline markup used by the help copy. Keeping the components here (rather
  // than in the catalog) is what lets a translator move a button or an
  // emphasised term to wherever their language needs it in the sentence.
  const tags = {
    b: (chunks: React.ReactNode) => <b>{chunks}</b>,
    em: (chunks: React.ReactNode) => (
      <Strong size={500} fontStyle="italic">
        {chunks}
      </Strong>
    ),
    tab: (chunks: React.ReactNode) => <Tab isSelected>{chunks}</Tab>,
    createButton: (chunks: React.ReactNode) => (
      <Button
        marginX={4}
        appearance="primary"
        intent="success"
        iconAfter={PlusIcon}
      >
        {chunks}
      </Button>
    ),
    saveButton: (chunks: React.ReactNode) => (
      <Button marginX={4} appearance="primary">
        {chunks}
      </Button>
    ),
    cog: () => (
      <span>
        <CogIcon marginX={4} />
      </span>
    ),
    mail: (chunks: React.ReactNode) => (
      <a href="mailto:adresse@data.gouv.fr">{chunks}</a>
    ),
  };

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/f2b6yiXosmfoKkmyF4YLtE`}
      />
      <Tuto title={t("create.title")}>
        <Paragraph marginTop="default">
          {t.rich("create.intro", tags)}
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t.rich("create.step1", tags)}</ListItem>
          <ListItem>{t("create.step2")}</ListItem>
          <ListItem>{t("create.step3")}</ListItem>
          <ListItem>{t.rich("create.step4", tags)}</ListItem>
          <ListItem>{t.rich("create.step5", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("import.title")}>
        <Paragraph marginTop="default">
          {t.rich("import.intro", tags)}
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t.rich("import.step1", tags)}</ListItem>
          <ListItem>{t.rich("import.step2", tags)}</ListItem>
          <ListItem>{t("import.step3")}</ListItem>
          <ListItem>{t.rich("import.step4", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("administer.title")}>
        <Paragraph marginTop="default">
          {t.rich("administer.intro", tags)}
        </Paragraph>
        <Paragraph marginTop="default">{t("administer.youCan")}</Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t("administer.item1")}</ListItem>
          <ListItem>{t("administer.item2")}</ListItem>
          <ListItem>{t("administer.item3")}</ListItem>
        </OrderedList>

        <Paragraph marginTop="default">
          {t.rich("administer.outro", tags)}
        </Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotEdit")} />

        <Tuto title={t("problems.communeNotFound.title")}>
          <Paragraph marginTop="default">
            {t.rich("problems.communeNotFound.content", tags)}
          </Paragraph>
        </Tuto>

        <BALRecovery />
      </Problems>
    </Pane>
  );
}

export default BaseLocale;
