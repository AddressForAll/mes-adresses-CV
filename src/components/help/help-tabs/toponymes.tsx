import { useContext } from "react";
import { OrderedList, Pane, ListItem, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";

import CountryContext from "@/contexts/country";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import ParcellesColorCode from "@/components/help/help-tabs/parcelles";
import helpTags from "@/components/help/tags";

function Toponymes() {
  const t = useTranslations("help.toponymes");
  const { countryProfile } = useContext(CountryContext);

  // Every tutorial on this tab opens with the same instruction.
  const before = (
    <Paragraph marginTop="default">{t.rich("openList", helpTags)}</Paragraph>
  );

  return (
    <Pane>
      <Tuto title={t("about.title")}>
        <Paragraph marginTop="default">
          {t.rich("about.content", helpTags)}
        </Paragraph>
      </Tuto>

      <Tuto title={t("add.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("add.step1", helpTags)}</ListItem>
          <ListItem>{t.rich("add.step2", helpTags)}</ListItem>
          <ListItem>{t.rich("add.step3", helpTags)}</ListItem>
          <ListItem>{t.rich("add.step4", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("link.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t("link.step1")}</ListItem>
          <ListItem>{t.rich("link.step2", helpTags)}</ListItem>
          <ListItem>{t.rich("link.step3", helpTags)}</ListItem>
          <ListItem>{t.rich("link.step4", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("edit.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
          <ListItem>{t.rich("edit.step2", helpTags)}</ListItem>
          <ListItem>{t.rich("edit.step3", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("delete.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
          <ListItem>{t.rich("delete.step2", helpTags)}</ListItem>
          <ListItem>{t.rich("delete.step3", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      {countryProfile.hasCadastre && (
        <Tuto title={t("parcelles.title")}>
          {before}
          <OrderedList margin={8}>
            <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
            <ListItem>{t.rich("edit.step2", helpTags)}</ListItem>
            <ListItem>{t("parcelles.step3")}</ListItem>
            <ListItem>{t.rich("parcelles.step4", helpTags)}</ListItem>
          </OrderedList>
          <ParcellesColorCode />
        </Tuto>
      )}

      <Problems>
        <Unauthorized title={t("problems.cannotAddOrDelete")} />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Toponymes;
