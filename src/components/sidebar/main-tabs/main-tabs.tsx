"use client";

import { useContext, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Pane, Pulsar } from "evergreen-ui";
import Link from "next/link";
import styles from "./main-tabs.module.css";
import SignalementContext from "@/contexts/signalement";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import SearchPaginationContext from "@/contexts/search-pagination";
import { getLinkWithPagination } from "@/hooks/search-pagination";
import DynamicTextIcon from "./dynamic-text-icon/dynamic-text-icon";
import ResponsiveImage from "@/components/responsive-image";
import { usePathname } from "next/navigation";
import CountryContext from "@/contexts/country";
import MunicipalityTabIcon from "./municipality-tab-icon";

export enum TabsEnum {
  COMMUNE = "commune",
  VOIES = "voies",
  TOPONYMES = "toponymes",
  SIGNALEMENTS = "signalements",
}

interface MainTabsProps {
  balId: string;
}

function MainTabs({ balId }: MainTabsProps) {
  const t = useTranslations("mainTabs");
  const pathname = usePathname();
  const { country } = useContext(CountryContext);
  const tabLabels = {
    [TabsEnum.VOIES]: [t("voiesTabLabel")],
    [TabsEnum.TOPONYMES]: [t("toponymesTabLabel")],
  };

  const selectedTab = useMemo(() => {
    const splittedPath = pathname.split("/");
    const innerPath = splittedPath?.[3];

    return innerPath;
  }, [pathname]);

  const { pendingSignalementsCount, archivedSignalementsCount } =
    useContext(SignalementContext);
  const communeHasSignalements =
    pendingSignalementsCount > 0 || archivedSignalementsCount > 0;
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const { isEditing } = useContext(BalDataContext);
  const { savedSearchPagination } = useContext(SearchPaginationContext);
  const isTabSelected = (tabKey: TabsEnum, index: number) => {
    return selectedTab ? selectedTab === tabKey : index === 0;
  };

  return (
    <div className={`${styles.mainTabs}${isEditing ? ` ${styles.hide}` : ""}`}>
      <div className={styles.tabsList} role="tablist">
        {[
          {
            key: TabsEnum.COMMUNE,
            icon: (
              <div className={styles.tabImage}>
                <MunicipalityTabIcon
                  country={country}
                  label={t("communeTabIllustration")}
                  className={styles.tabImage}
                />
              </div>
            ),
            href: `/bal/${balId}`,
          },
          {
            key: TabsEnum.VOIES,
            icon: (
              <DynamicTextIcon
                selectedTextIndex={0}
                className={styles.tabImage}
                texts={tabLabels[TabsEnum.VOIES]}
              >
                <ResponsiveImage
                  src="/static/images/icone-voies.png"
                  alt={t("voiesTabIllustration")}
                  draggable={false}
                  orientation="portrait"
                  unoptimized
                />
              </DynamicTextIcon>
            ),
            href: getLinkWithPagination(
              `/bal/${balId}/${TabsEnum.VOIES}`,
              savedSearchPagination[TabsEnum.VOIES]
            ),
          },
          {
            key: TabsEnum.TOPONYMES,
            icon: (
              <DynamicTextIcon
                selectedTextIndex={0}
                className={styles.tabImage}
                texts={tabLabels[TabsEnum.TOPONYMES]}
              >
                <ResponsiveImage
                  src="/static/images/icone-toponymes.png"
                  alt={t("toponymesTabIllustration")}
                  draggable={false}
                  orientation="portrait"
                  unoptimized
                />
              </DynamicTextIcon>
            ),
            href: getLinkWithPagination(
              `/bal/${balId}/${TabsEnum.TOPONYMES}`,
              savedSearchPagination[TabsEnum.TOPONYMES]
            ),
          },
          {
            key: TabsEnum.SIGNALEMENTS,
            icon: (
              <div className={styles.tabImage}>
                <ResponsiveImage
                  className={styles.tabImage}
                  src="/static/images/icone-signalements.png"
                  alt={t("signalementsTabIllustration")}
                  draggable={false}
                  orientation="portrait"
                  unoptimized
                />
              </div>
            ),
            notif: pendingSignalementsCount,
            href: `/bal/${balId}/${TabsEnum.SIGNALEMENTS}`,
            isHidden: !isAdmin || !communeHasSignalements,
          },
        ]
          .filter(({ isHidden }) => !isHidden)
          .map(({ notif, key, href, icon }, index) => {
            const isSelected = isTabSelected(key, index);
            const tab = (
              <Link
                key={key}
                title={t("tabTitle", { tab: key })}
                className={styles.tabLink}
                role="tab"
                href={href}
                shallow
                draggable={false}
              >
                <Pane
                  className={`${styles.tab}${
                    isSelected ? ` ${styles.selected}` : ""
                  }`}
                  {...(isSelected && { elevation: 1 })}
                >
                  {icon}
                  {notif > 0 && <Pulsar size={16} right={0} top={0} />}
                </Pane>
              </Link>
            );

            return tab;
          })}
      </div>
    </div>
  );
}
export default MainTabs;
