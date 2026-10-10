import { useContext } from "react";
import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  ColumnLayoutIcon,
  MapIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import CountryContext from "@/contexts/country";
import Tuto from "@/components/help/tuto";
import SubTuto from "@/components/help/tuto/sub-tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import ParcellesColorCode from "@/components/help/help-tabs/parcelles";
import HelpScreenshot from "@/components/help/help-screenshot";
import helpTags from "@/components/help/tags";

function Numeros() {
  const t = useTranslations("help.numeros");
  const { countryProfile } = useContext(CountryContext);

  // Most tutorials on this tab open with the same instruction.
  const before = (
    <Paragraph marginTop="default">{t.rich("openList", helpTags)}</Paragraph>
  );

  // The "add a number" steps are identical whether started from the sidebar or
  // from the map, apart from the very first click — so they share their keys.
  const addCommonSteps = (
    <>
      <ListItem>{t.rich("add.dragMarker", helpTags)}</ListItem>
      <ListItem>{t.rich("add.number", helpTags)}</ListItem>
      <ListItem>{t.rich("add.numberless", helpTags)}</ListItem>
      <ListItem>{t.rich("add.selectVoie", helpTags)}</ListItem>
      <ListItem>{t.rich("add.positionType", helpTags)}</ListItem>
      <ListItem>{t.rich("add.finish", helpTags)}</ListItem>
    </>
  );

  return (
    <Pane>
      <Tuto title={t("goodToKnow.title")}>
        <Paragraph marginTop="default">
          {t.rich("goodToKnow.content", helpTags)}
        </Paragraph>
      </Tuto>

      <Tuto title={t("add.title")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("add.fromSidebarStep", helpTags)}</ListItem>
            {addCommonSteps}
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("add.fromMapStep", helpTags)}</ListItem>
            {addCommonSteps}
          </OrderedList>
        </SubTuto>

        <HelpScreenshot name="numeroForm" />
      </Tuto>

      <Tuto title={t("edit.title")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
            <ListItem>{t.rich("chooseEdit", helpTags)}</ListItem>
            <ListItem>{t.rich("edit.whatYouCanChange", helpTags)}</ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("edit.clickNumber")}</ListItem>
            <ListItem>{t.rich("edit.whatYouCanChange", helpTags)}</ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("delete.title")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
            <ListItem>{t.rich("chooseDelete", helpTags)}</ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("delete.rightClick")}</ListItem>
            <ListItem>{t.rich("chooseDelete", helpTags)}</ListItem>
          </OrderedList>
        </SubTuto>

        <Paragraph marginTop="default">
          {t.rich("delete.bin", helpTags)}
        </Paragraph>
      </Tuto>

      <Tuto title={t("bulk.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t("bulk.step1")}</ListItem>
          <ListItem>{t.rich("bulk.step2", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("uncertify.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
          <ListItem>{t.rich("chooseEdit", helpTags)}</ListItem>
          <ListItem>{t.rich("uncertify.step3", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("comment.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
          <ListItem>{t.rich("chooseEdit", helpTags)}</ListItem>
          <ListItem>{t.rich("comment.step3", helpTags)}</ListItem>
          <ListItem>{t.rich("comment.step4", helpTags)}</ListItem>
        </OrderedList>
        <Paragraph>{t.rich("comment.icon", helpTags)}</Paragraph>
      </Tuto>

      {countryProfile.hasCadastre && (
        <Tuto title={t("parcelles.title")}>
          {before}
          <OrderedList margin={8}>
            <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
            <ListItem>{t.rich("chooseEdit", helpTags)}</ListItem>
            <ListItem>{t("parcelles.step3")}</ListItem>
            <ListItem>{t.rich("parcelles.step4", helpTags)}</ListItem>
          </OrderedList>
          <ParcellesColorCode />
        </Tuto>
      )}

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
