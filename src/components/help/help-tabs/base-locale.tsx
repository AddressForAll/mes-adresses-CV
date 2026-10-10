import { useContext } from "react";
import { Alert, Pane, OrderedList, ListItem, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";

import CountryContext from "@/contexts/country";
import BALRecovery from "@/components/bal-recovery/bal-recovery";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import HelpScreenshot from "@/components/help/help-screenshot";
import helpTags from "@/components/help/tags";

function BaseLocale() {
  const t = useTranslations("help.baseLocale");
  const { countryProfile } = useContext(CountryContext);

  return (
    <Pane>
      <Tuto title={t("about.title")}>
        <Paragraph marginTop="default">
          {t.rich("about.content", helpTags)}
        </Paragraph>
        <Paragraph marginTop="default">
          {t.rich("about.countryLanguage", helpTags)}
        </Paragraph>
      </Tuto>

      <Tuto title={t("create.title")}>
        <Paragraph marginTop="default">
          {t.rich("create.intro", helpTags)}
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            {t.rich("create.step1", helpTags)}
            <HelpScreenshot name="newTerritory" />
          </ListItem>
          <ListItem>
            {t.rich("create.step2", helpTags)}
            <HelpScreenshot name="newImport" />
          </ListItem>
          <ListItem>
            {t.rich("create.step3", helpTags)}
            <HelpScreenshot name="newDetails" />
          </ListItem>
        </OrderedList>
        <Paragraph>{t.rich("create.demo", helpTags)}</Paragraph>
      </Tuto>

      <Tuto title={t("existing.title")}>
        <Paragraph marginTop="default">
          {t.rich("existing.content", helpTags)}
        </Paragraph>
        <HelpScreenshot name="publicBals" />
      </Tuto>

      <Tuto title={t("access.title")}>
        <Paragraph marginTop="default">
          {t.rich("access.content", helpTags)}
        </Paragraph>
        {!countryProfile.hasAccessRecovery && (
          <Alert intent="warning" marginTop={16} title={t("access.warning")} />
        )}
      </Tuto>

      <Tuto title={t("administer.title")}>
        <Paragraph marginTop="default">
          {t.rich("administer.intro", helpTags)}
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t("administer.item1")}</ListItem>
          <ListItem>{t("administer.item2")}</ListItem>
          <ListItem>{t("administer.item3")}</ListItem>
          <ListItem>{t("administer.item4")}</ListItem>
        </OrderedList>
        <HelpScreenshot name="settings" />
        <Paragraph marginTop="default">
          {t.rich("administer.outro", helpTags)}
        </Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotEdit")} />

        <Tuto title={t("problems.communeNotFound.title")}>
          <Paragraph marginTop="default">
            {t.rich("problems.communeNotFound.content", helpTags)}
          </Paragraph>
        </Tuto>

        {countryProfile.hasAccessRecovery && <BALRecovery />}
      </Problems>
    </Pane>
  );
}

export default BaseLocale;
