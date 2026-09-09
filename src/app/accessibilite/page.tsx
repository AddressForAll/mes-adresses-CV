"use client";

import { useRouter } from "next/navigation";
import Image from "next/legacy/image";

import {
  Pane,
  Heading,
  Paragraph,
  Text,
  Strong,
  UnorderedList,
  ListItem,
  DeleteIcon,
  Button,
  EnvelopeIcon,
  Link,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

export default function Accessibilite() {
  const t = useTranslations("accessibility");
  const router = useRouter();

  // Inline markup for the declaration copy, so translators can move the
  // emphasised terms to wherever their language needs them.
  const tags = {
    strong: (chunks: React.ReactNode) => <Strong>{chunks}</Strong>,
    br: () => <br />,
  };

  return (
    <>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="4em"
        marginX="6em"
        marginTop="2em"
        fontSize={14}
      >
        <Pane width="100%" maxWidth={500} textAlign="center">
          <Image
            src="/static/images/accessibilite-illustration.svg"
            layout="responsive"
            height={100}
            width={500}
            alt=""
          />
        </Pane>

        <Pane gap="1em" display="flex" flexDirection="column">
          <Heading is="h2" size={900} color="#2952CC">
            {t("title")}
          </Heading>
          <Pane display="flex" flexDirection="column" justifyContent="center">
            <Pane>
              <Paragraph lineHeight="200%">
                {t.rich("commitment", tags)}
              </Paragraph>
              <UnorderedList>
                <ListItem>{t("action1")}</ListItem>
                <ListItem>{t("action2")}</ListItem>
              </UnorderedList>
            </Pane>

            <Pane
              width="fit-content"
              padding="1em"
              background="#EBF0FF"
              border="solid 3px #2952CC"
              borderRadius={5}
              marginTop={20}
            >
              <Text fontSize={16}>{t.rich("declarationDate", tags)}</Text>
            </Pane>
          </Pane>
        </Pane>

        <Pane display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            {t("complianceStatus")}
          </Heading>
          <Pane
            padding="2em"
            background="#FDF4F4"
            border="solid 3px #D14343"
            borderRadius={5}
            textAlign="center"
            width="fit-content"
          >
            <Text color="#D14343" fontSize={22} fontWeight={600}>
              <DeleteIcon size={22} marginRight={8} />
              {t("nonCompliant")}
            </Text>
          </Pane>
          <Paragraph lineHeight="200%">
            {t.rich("complianceContent", tags)}
          </Paragraph>
        </Pane>

        <Pane width="100%" display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            {t("infoAndContact")}
          </Heading>
          <Paragraph width="100%" lineHeight="200%">
            {t("infoAndContactContent")}
          </Paragraph>
          <Button
            onClick={async () => {
              await router.push("mailto:adresse@data.gouv.fr");
            }}
            appearance="primary"
            iconBefore={EnvelopeIcon}
            width="fit-content"
          >
            {t("contactUs")}
          </Button>
        </Pane>

        <Pane
          width="100%"
          display="flex"
          flexDirection="column"
          gap="1em"
          marginBottom="2em"
        >
          <Heading is="h3" size={800} color="#2952CC">
            {t("remedies")}
          </Heading>
          <Pane>
            <Paragraph>{t.rich("remediesContent", tags)}</Paragraph>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://formulaire.defenseurdesdroits.fr"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  {t.rich("remedyWrite", tags)}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.defenseurdesdroits.fr/saisir/delegues"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  {t.rich("remedyDelegate", tags)}
                </Link>{" "}
                {t("remedyDelegateSuffix")}
              </ListItem>
              <ListItem>
                {t("remedyPost")}
                <br />
                <Strong>
                  Défenseur des droits
                  <br />
                  Libre réponse 71120
                  <br />
                  75342 Paris CEDEX 07
                </Strong>
              </ListItem>
            </UnorderedList>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
}
