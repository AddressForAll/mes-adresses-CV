import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  Strong,
  Button,
  Menu,
  IconButton,
  MapMarkerIcon,
  CommentIcon,
  ColumnLayoutIcon,
  Badge,
  AddIcon,
  MapIcon,
  MoreIcon,
  EditIcon,
  TrashIcon,
  EndorsedIcon,
  PlusIcon,
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

function Numeros() {
  const t = useTranslations("help.numeros");

  // Inline markup for the help copy — see base-locale.tsx for the rationale.
  const tags = {
    b: (chunks: React.ReactNode) => <b>{chunks}</b>,
    field: (chunks: React.ReactNode) => <Strong size={500}>{chunks}</Strong>,
    marker: () => <MapMarkerIcon color="info" />,
    commentIcon: () => <CommentIcon />,
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
    addIconButton: () => (
      <IconButton
        marginLeft={8}
        icon={AddIcon}
        intent="success"
        appearance="primary"
      />
    ),
    createVoieButton: (chunks: React.ReactNode) => (
      <Button marginX={4} iconBefore={PlusIcon}>
        {chunks}
      </Button>
    ),
    certifyButton: (chunks: React.ReactNode) => (
      <Button
        marginX={4}
        appearance="primary"
        intent="success"
        iconAfter={EndorsedIcon}
      >
        {chunks}
      </Button>
    ),
    saveButton: (chunks: React.ReactNode) => (
      <Button marginX={4} intent="success">
        {chunks}
      </Button>
    ),
    dangerButton: (chunks: React.ReactNode) => (
      <Button marginX={4} intent="danger">
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
  };

  // Most tutorials on this tab open with the same instruction.
  const before = <Paragraph marginTop="default">{t("openList")}</Paragraph>;

  // The "add a number" steps are identical whether started from the sidebar or
  // from the map, apart from the very first click — so they share their keys.
  const addCommonSteps = (
    <>
      <ListItem>{t.rich("add.dragMarker", tags)}</ListItem>
      <ListItem>{t.rich("add.number", tags)}</ListItem>
      <ListItem>{t.rich("add.suffix", tags)}</ListItem>
      <ListItem>{t.rich("add.selectVoie", tags)}</ListItem>
      <ListItem>{t.rich("add.positionType", tags)}</ListItem>
      <ListItem>{t.rich("add.finish", tags)}</ListItem>
    </>
  );

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/ts9chg7zehHXkTrotsjpqr`}
      />
      <Tuto title={t("goodToKnow.title")}>
        <ListItem listStyleType="none">
          {t.rich("goodToKnow.content", tags)}
        </ListItem>
      </Tuto>

      <Tuto title={t("add.title")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("add.fromSidebarStep", tags)}</ListItem>
            {addCommonSteps}
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t.rich("add.fromMapStep", tags)}
              </Pane>
            </ListItem>
            {addCommonSteps}
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("edit.title")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("moreButtonStep", tags)}</ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t.rich("chooseEdit", tags)}
              </Pane>
            </ListItem>
            <ListItem>{t.rich("edit.whatYouCanChange", tags)}</ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("edit.clickNumber")}</ListItem>
            <ListItem>{t.rich("edit.whatYouCanChange", tags)}</ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("delete.title")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("moreButtonStep", tags)}</ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t.rich("chooseDelete", tags)}
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("delete.rightClick")}</ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t.rich("chooseDelete", tags)}
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("uncertify.title")}>
        <OrderedList margin={8}>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t("openList")}
            </Pane>
          </ListItem>
          <ListItem>{t.rich("uncertify.step2", tags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("parcelles.title")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", tags)}</ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t.rich("chooseEdit", tags)}
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

      <Tuto title={t("comment.title")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", tags)}</ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t.rich("chooseEdit", tags)}
            </Pane>
          </ListItem>
          <ListItem>{t.rich("comment.step3", tags)}</ListItem>
          <ListItem>{t.rich("comment.step4", tags)}</ListItem>
        </OrderedList>

        <Paragraph>{t.rich("comment.icon", tags)}</Paragraph>
      </Tuto>

      <Problems>
        <Tuto title={t("problems.voieNotFound.title")}>
          <Paragraph marginTop="default">
            {t("problems.voieNotFound.content")}
          </Paragraph>
        </Tuto>

        <Unauthorized title={t("problems.cannotAddOrDelete")} />

        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Numeros;
