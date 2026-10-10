import { Pane, Paragraph, OrderedList, ListItem } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import HelpScreenshot from "@/components/help/help-screenshot";
import helpTags from "@/components/help/tags";

function Voies() {
  const t = useTranslations("help.voies");

  // Every tutorial on this tab opens with the same instruction.
  const before = (
    <Paragraph marginTop="default">{t.rich("openList", helpTags)}</Paragraph>
  );

  return (
    <Pane>
      <Tuto title={t("add.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("add.step1", helpTags)}</ListItem>
          <ListItem>{t.rich("add.step2", helpTags)}</ListItem>
          <ListItem>{t.rich("add.step3", helpTags)}</ListItem>
          <ListItem>{t.rich("add.step4", helpTags)}</ListItem>
        </OrderedList>
        <HelpScreenshot name="voieForm" />
      </Tuto>

      <Tuto title={t("view.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("view.fromList", helpTags)}</ListItem>
          <ListItem>{t.rich("view.fromMenu", helpTags)}</ListItem>
          <ListItem>{t("view.fromMap")}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("rename.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
          <ListItem>{t.rich("rename.step2", helpTags)}</ListItem>
          <ListItem>{t.rich("rename.step3", helpTags)}</ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("certify.title")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t.rich("moreButtonStep", helpTags)}</ListItem>
          <ListItem>{t.rich("certify.step2", helpTags)}</ListItem>
          <ListItem>{t("certify.step3")}</ListItem>
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

      <Tuto title={t("suggestions.title")}>
        <Paragraph marginTop="default">
          {t.rich("suggestions.content", helpTags)}
        </Paragraph>
        <HelpScreenshot name="voiesList" />
        <Paragraph>{t.rich("suggestions.handle", helpTags)}</Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotAddOrDelete")} />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Voies;
