import { Paragraph, IconButton, ChevronRightIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";

function Sidebar() {
  const t = useTranslations("help.sidebarTuto");

  return (
    <Tuto title={t("title")}>
      <Paragraph marginTop="default">{t("hidden")}</Paragraph>
      <Paragraph marginTop="default">
        {t.rich("showAgain", {
          button: () => (
            <IconButton
              display="inline-block"
              margin={8}
              icon={ChevronRightIcon}
            />
          ),
        })}
      </Paragraph>
    </Tuto>
  );
}

export default Sidebar;
