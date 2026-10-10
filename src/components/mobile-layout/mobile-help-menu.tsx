import { useContext } from "react";
import { IconButton, HelpIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import HelpContext from "@/contexts/help";

// The help panel is the only entry left (the upstream video and guide links
// were French-only), so this is a plain toggle rather than a popover menu.
export function MobileHelpMenu() {
  const t = useTranslations("header");
  const { showHelp, setShowHelp } = useContext(HelpContext);

  return (
    <IconButton
      appearance="minimal"
      icon={HelpIcon}
      aria-label={t("help")}
      title={t("help")}
      onClick={() => setShowHelp(!showHelp)}
    />
  );
}
