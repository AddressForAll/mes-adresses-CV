import { Alert, ListItem, Pane, Paragraph, UnorderedList } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import HelpScreenshot from "@/components/help/help-screenshot";
import helpTags from "@/components/help/tags";

function Share() {
  const t = useTranslations("help.share");

  return (
    <Pane>
      <Tuto title={t("download.title")}>
        <Paragraph marginTop="default">
          {t.rich("download.intro", helpTags)}
        </Paragraph>
        <UnorderedList margin={8}>
          <ListItem>{t.rich("download.item1", helpTags)}</ListItem>
          <ListItem>{t.rich("download.item2", helpTags)}</ListItem>
        </UnorderedList>
        <HelpScreenshot name="downloads" />
        <Alert intent="warning" title={t("download.comments")} />
      </Tuto>

      <Tuto title={t("editAccess.title")}>
        <Paragraph marginTop="default">
          {t.rich("editAccess.content", helpTags)}
        </Paragraph>
        <Paragraph marginTop="default">{t("editAccess.warning")}</Paragraph>
      </Tuto>

      <Tuto title={t("viewAccess.title")}>
        <Paragraph marginTop="default">
          {t.rich("viewAccess.content", helpTags)}
        </Paragraph>
      </Tuto>

      <Tuto title={t("publication.title")}>
        <Paragraph marginTop="default">
          {t.rich("publication.content", helpTags)}
        </Paragraph>
        <Paragraph marginTop="default">
          {t.rich("publication.draft", helpTags)}
        </Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotEdit")} />
      </Problems>
    </Pane>
  );
}

export default Share;
