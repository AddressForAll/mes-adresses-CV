"use client";
import NextLink from "next/link";
import { useContext } from "react";
import { Pane, Text, Button, WarningSignIcon, Link } from "evergreen-ui";
import { useTranslations } from "next-intl";

import LayoutContext from "@/contexts/layout";

interface AlreadyBalPublishedWarningProps {
  otherBalIdPublished: string;
  communeName: string;
  isReadonly: boolean;
}

function AlreadyBalPublishedWarning({
  otherBalIdPublished,
  communeName,
  isReadonly,
}: AlreadyBalPublishedWarningProps) {
  const t = useTranslations("alreadyPublishedWarning");
  const { isMobile } = useContext(LayoutContext);

  return (
    <Pane
      width="100%"
      textAlign="center"
      backgroundColor="orange"
      position="fixed"
      bottom={isReadonly ? 50 : 0}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <WarningSignIcon
        size={20}
        marginX=".5em"
        style={{ verticalAlign: "sub" }}
      />
      <Text is="p" fontSize={isMobile ? 10 : 14}>
        {t("message", { communeName })}
      </Text>

      <Button
        height={24}
        marginX=".5em"
        is={NextLink}
        href={`/bal/${otherBalIdPublished}`}
      >
        {t("goToPublished")}
      </Button>
      <Text is="p" fontSize={isMobile ? 10 : 14}>
        {t("orContactSupport")}{" "}
        <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
      </Text>
    </Pane>
  );
}

export default AlreadyBalPublishedWarning;
