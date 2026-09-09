"use client";

import { Heading, Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";

import ProductTour from "@/components/product-tour";

export default function SignalementProductTour() {
  const t = useTranslations("signalementTour");

  // Built inside the component so the copy goes through the catalog; the
  // targets are CSS selectors and must stay language-independent.
  const steps = [
    {
      target: "body",
      placement: "center",
      content: (
        <Pane>
          <Heading size={800}>{t("welcomeTitle")}</Heading>
          <Paragraph margin={20} textAlign="justify">
            {t("welcomeContent")}
          </Paragraph>
        </Pane>
      ),
    },
    {
      target: "div[role='tablist'] > a:last-child",
      content: (
        <Pane>
          <Paragraph>{t("goToTab")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 15,
      callback: () => {
        const element = document.querySelector(
          "div[role='tablist'] > a:last-child"
        ) as HTMLElement | null;
        if (element) {
          element.click();
        } else {
          console.warn("Element not found: div[role='tablist'] > a:last-child");
        }
      },
    },
    {
      target: "div[role='tablist'] > span:nth-child(1)",
      content: (
        <Pane>
          <Paragraph>{t("pendingTab")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: "div[role='tablist'] > span:nth-child(2)",
      content: (
        <Pane>
          <Paragraph>{t("archivedTab")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: ".signalement-search input",
      content: (
        <Pane>
          <Paragraph>{t("searchByName")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 20,
    },
    {
      target: ".filter-button",
      content: (
        <Pane>
          <Paragraph>{t("filterByType")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: ".main-table-cell",
      content: (
        <Pane>
          <Paragraph>{t("selectFromList")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
    {
      target: ".maplibregl-marker",
      content: (
        <Pane>
          <Paragraph>{t("selectFromMap")}</Paragraph>
        </Pane>
      ),
      spotlightPadding: 5,
    },
  ];

  return <ProductTour steps={steps} localStorageKey="signalement" />;
}
