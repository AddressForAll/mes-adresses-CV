import { Pane, Text, Button, defaultTheme } from "evergreen-ui";
import { useTranslations } from "next-intl";
import NextLink from "next/link";

interface WarningLinkProps {
  title: string;
  url: string;
}

function WarningLink({ title, url }: WarningLinkProps) {
  const t = useTranslations("warnings");

  return (
    <>
      <Pane marginBottom={8}>
        <Text>{title}</Text>
      </Pane>
      <Button
        is={NextLink}
        href={url}
        title={t("editVoie")}
        size="small"
        appearance="primary"
        style={{ backgroundColor: defaultTheme.colors.purple600 }}
        onClick={(e) => e.stopPropagation()}
      >
        {t("improve")}
      </Button>
    </>
  );
}

export default WarningLink;
