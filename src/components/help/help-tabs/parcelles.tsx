import { Badge, Pane, Paragraph, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";

/** Colour key of the cadastre layer, shared by the place-name and number tabs. */
function ParcellesColorCode() {
  const t = useTranslations("help.parcelles");

  return (
    <Pane>
      <Strong>{t("colorCode")}</Strong>
      <Paragraph display="flex">
        <Badge margin={4} height="100%" color="green">
          {t("linked")}
        </Badge>
        <Badge margin={4} height="100%" color="yellow">
          {t("linkable")}
        </Badge>
        <Badge margin={4} height="100%" color="red">
          {t("unlinkable")}
        </Badge>
      </Paragraph>
    </Pane>
  );
}

export default ParcellesColorCode;
