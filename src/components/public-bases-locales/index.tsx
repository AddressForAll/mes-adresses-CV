import {
  ArrowRightIcon,
  Badge,
  Button,
  Card,
  Heading,
  Pane,
  Paragraph,
  Text,
} from "evergreen-ui";
import NextLink from "next/link";
import { useFormatter, useTranslations } from "next-intl";

import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { getCountry } from "@/lib/countries";

interface PublicBasesLocalesProps {
  basesLocales: ExtendedBaseLocaleDTO[];
}

export default function PublicBasesLocales({
  basesLocales,
}: PublicBasesLocalesProps) {
  const t = useTranslations("publicBasesLocales");
  const format = useFormatter();

  if (basesLocales.length === 0) {
    return null;
  }

  return (
    <Pane
      id="public-bases-locales"
      padding={24}
      margin={16}
      background="tint1"
      borderRadius={8}
    >
      <Heading is="h2" size={700} textAlign="center">
        {t("title")}
      </Heading>
      <Paragraph marginTop={8} textAlign="center" color="muted">
        {t("intro")}
      </Paragraph>
      <Pane
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={16}
        marginTop={20}
      >
        {basesLocales.map((baseLocale) => (
          <Card
            key={baseLocale.id}
            width={300}
            minHeight={210}
            padding={20}
            background="white"
            border
            elevation={1}
            display="flex"
            flexDirection="column"
          >
            <Pane display="flex" justifyContent="space-between" gap={8}>
              <Text color="muted">
                {t("location", {
                  country: getCountry(baseLocale.country).label,
                  territory: baseLocale.communeNom || baseLocale.commune,
                })}
              </Text>
              <Badge color="neutral" flexShrink={0} whiteSpace="nowrap">
                {t("readOnly")}
              </Badge>
            </Pane>
            <Heading is="h3" size={600} marginTop={12}>
              {baseLocale.nom}
            </Heading>
            <Paragraph marginTop={8} flex={1}>
              {t("addresses", {
                count: format.number(baseLocale.nbNumeros),
              })}
            </Paragraph>
            <Button
              is={NextLink}
              href={`/bal/${baseLocale.id}`}
              appearance="primary"
              iconAfter={ArrowRightIcon}
              marginTop={16}
              alignSelf="flex-start"
            >
              {t("view")}
            </Button>
          </Card>
        ))}
      </Pane>
    </Pane>
  );
}
