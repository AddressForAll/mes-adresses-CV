import { Paragraph, Button, EditIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";

interface UnauthorizedProps {
  title: string;
}

function Unauthorized({ title }: UnauthorizedProps) {
  const t = useTranslations("help.unauthorized");

  return (
    <Tuto title={title}>
      <Paragraph marginTop="default">
        {t.rich("checkBadge", {
          badge: (chunks) => (
            <Button
              height={24}
              margin={8}
              appearance="primary"
              intent="danger"
              iconBefore={EditIcon}
            >
              {chunks}
            </Button>
          ),
        })}
      </Paragraph>
      <Paragraph marginTop="default">{t("meaning")}</Paragraph>
      <Paragraph marginTop="default">{t("fix")}</Paragraph>
    </Tuto>
  );
}

export default Unauthorized;
