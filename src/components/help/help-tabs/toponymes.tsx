import {
  OrderedList,
  Pane,
  ListItem,
  Button,
  AddIcon,
  MapMarkerIcon,
  Menu,
  MoreIcon,
  Paragraph,
  Tab,
  Heading,
  Badge,
  Strong,
  EditIcon,
  Text,
  TrashIcon,
  Select,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function Toponymes() {
  const t = useTranslations("help.toponymes");

  // Inline markup for the help copy — see base-locale.tsx for the rationale.
  const tags = {
    br: () => <br />,
    muted: (chunks: React.ReactNode) => (
      <Text color="muted">
        <i>{chunks}</i>
      </Text>
    ),
    tab: (chunks: React.ReactNode) => (
      <Tab>
        <Heading size={300}>{chunks}</Heading>
      </Tab>
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
    dangerButton: (chunks: React.ReactNode) => (
      <Button marginX={4} intent="danger" appearance="primary">
        {chunks}
      </Button>
    ),
    moreButton: () => (
      <Button background="tint1" iconBefore={MoreIcon} appearance="minimal" />
    ),
    editItem: (chunks: React.ReactNode) => (
      <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
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
    marker: () => <MapMarkerIcon color="info" />,
    trash: () => (
      <TrashIcon marginX={6} color="danger" verticalAlign="middle" />
    ),
    typeSelect: (chunks: React.ReactNode) => (
      <Select>
        <option>{chunks}</option>
      </Select>
    ),
  };

  // Every tutorial on this tab opens with the same instruction.
  const before = <Paragraph marginTop="default">{t("openList")}</Paragraph>;

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/7AeS1b84kmwjbL3A19Wphw`}
      />
      <Tuto title={t("add.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("add.step1", tags)}</ListItem>
          <ListItem>{t.rich("add.step2", tags)}</ListItem>
          <ListItem>{t.rich("add.step3", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("assign.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("assign.step1", tags)}</ListItem>
          <ListItem>{t("assign.step2")}</ListItem>
          <ListItem>{t("assign.step3")}</ListItem>
          <ListItem>{t.rich("assign.step4", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("edit.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t("edit.step1")}</ListItem>
          <ListItem>{t("edit.step2")}</ListItem>
          <ListItem>{t.rich("edit.step3", tags)}</ListItem>
          <ListItem>{t.rich("edit.step4", tags)}</ListItem>
          <ListItem>{t.rich("edit.step5", tags)}</ListItem>
        </OrderedList>
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

      <Tuto title={t("parcelles.title")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>{t.rich("parcelles.step1", tags)}</ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t.rich("parcelles.step2", tags)}
            </Pane>
          </ListItem>
          <ListItem>{t("parcelles.step3")}</ListItem>
          <ListItem>{t.rich("parcelles.step4", tags)}</ListItem>
        </OrderedList>

        <Pane>
          <Strong>{t("parcelles.colorCode")}</Strong>
          <Paragraph display="flex">
            <Badge margin={4} height="100%" color="green">
              {t("parcelles.linked")}
            </Badge>
            <Badge margin={4} height="100%" color="yellow">
              {t("parcelles.linkable")}
            </Badge>
            <Badge margin={4} height="100%" color="red">
              {t("parcelles.unlinkable")}
            </Badge>
          </Paragraph>
        </Pane>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotAddOrDelete")} />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Toponymes;
