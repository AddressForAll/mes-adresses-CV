import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  Strong,
  Menu,
  Button,
  AddIcon,
  ColumnLayoutIcon,
  MapIcon,
  MoreIcon,
  SendToMapIcon,
  TrashIcon,
  KeyTabIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import SubTuto from "@/components/help/tuto/sub-tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function Voies() {
  const t = useTranslations("help.voies");

  // Inline markup for the help copy — see base-locale.tsx for the rationale.
  const tags = {
    em: (chunks: React.ReactNode) => (
      <Strong size={500} fontStyle="italic">
        {chunks}
      </Strong>
    ),
    addButton: (chunks: React.ReactNode) => (
      <Button
        iconBefore={AddIcon}
        marginX={4}
        appearance="primary"
        intent="success"
      >
        {chunks}
      </Button>
    ),
    successButton: (chunks: React.ReactNode) => (
      <Button marginX={4} appearance="primary" intent="success">
        {chunks}
      </Button>
    ),
    primaryButton: (chunks: React.ReactNode) => (
      <Button marginX={4} appearance="primary">
        {chunks}
      </Button>
    ),
    dangerButton: (chunks: React.ReactNode) => (
      <Button marginX={4} intent="danger" appearance="primary">
        {chunks}
      </Button>
    ),
    moreButton: () => (
      <Button background="tint1" iconBefore={MoreIcon} appearance="minimal" />
    ),
    viewItem: (chunks: React.ReactNode) => (
      <Menu.Item background="tint1" marginLeft={8} icon={SendToMapIcon}>
        {chunks}
      </Menu.Item>
    ),
    deleteItem: (chunks: React.ReactNode) => (
      <Menu.Item
        background="tint1"
        marginLeft={8}
        icon={TrashIcon}
        intent="danger"
      >
        {chunks}
      </Menu.Item>
    ),
    convertButton: (chunks: React.ReactNode) => (
      <Button iconBefore={KeyTabIcon} marginX={4}>
        {chunks}
      </Button>
    ),
  };

  // Every tutorial on this tab opens with the same instruction.
  const before = <Paragraph marginTop="default">{t("openList")}</Paragraph>;

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/v2caTXtfYkvg6wUELBvLs2`}
      />
      <Tuto title={t("add.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("add.step1", tags)}</ListItem>
          <ListItem>{t.rich("add.step2", tags)}</ListItem>
          <ListItem>{t.rich("add.step3", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("rename.title")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>{t("rename.step1")}</ListItem>
          <ListItem>{t("rename.step2")}</ListItem>
          <ListItem>{t.rich("rename.step3", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("view.title")}>
        {before}

        <SubTuto title={t("view.fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("view.step1", tags)}</ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t.rich("view.step2", tags)}
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("view.fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("view.fromMapStep")}</ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("delete.title")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>{t.rich("delete.step1", tags)}</ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t.rich("delete.step2", tags)}
            </Pane>
          </ListItem>
          <ListItem>{t.rich("delete.step3", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("convert.title")}>
        {before}
        <Paragraph marginTop="default">{t("convert.intro")}</Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t.rich("convert.step1", tags)}</ListItem>
          <ListItem>{t.rich("convert.step2", tags)}</ListItem>
          <ListItem>{t.rich("convert.step3", tags)}</ListItem>
          <ListItem>{t("convert.step4")}</ListItem>
        </OrderedList>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotAddOrDelete")} />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Voies;
