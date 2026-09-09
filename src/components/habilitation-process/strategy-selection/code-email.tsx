import React, { useEffect, useMemo, useState } from "react";
import {
  Pane,
  Heading,
  Strong,
  Button,
  Alert,
  Text,
  OrderedList,
  Link,
  EnvelopeIcon,
  ListItem,
  SelectField,
  Spinner,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import TextWrapper from "@/components/text-wrapper";
import { ApiDepotService } from "@/lib/api-depot";

function isEmail(email) {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(String(email).toLowerCase());
}

function TextValidEmail() {
  const t = useTranslations("habilitation.codeEmail");

  return (
    <>
      <Alert
        title={t("outdatedEmailTitle")}
        width="100%"
        marginTop={16}
        textAlign="left"
        overflow="auto"
      >
        <TextWrapper placeholder={t("updateEmail")}>
          <AnnuaireServicePublic />
        </TextWrapper>
      </Alert>
    </>
  );
}

function TextInvalidEmail() {
  const t = useTranslations("habilitation.codeEmail");

  return (
    <Alert
      intent="danger"
      title={t("invalidEmailTitle")}
      marginTop={16}
      textAlign="left"
    >
      <TextWrapper placeholder={t("updateEmail")}>
        <AnnuaireServicePublic />
      </TextWrapper>
    </Alert>
  );
}

function AnnuaireServicePublic() {
  const t = useTranslations("habilitation.codeEmail");

  return (
    <OrderedList>
      <ListItem>
        {t.rich("annuaireStep1", {
          link: (chunks) => (
            <Link href="https://lannuaire.service-public.fr/">{chunks}</Link>
          ),
        })}
      </ListItem>
      <ListItem>{t("annuaireStep2")}</ListItem>
      <ListItem>{t("annuaireStep3")}</ListItem>
    </OrderedList>
  );
}

interface CodeEmailProps {
  codeCommune: string;
  emailSelected: string;
  setEmailSelected: React.Dispatch<React.SetStateAction<string>>;
  handleStrategy: () => void;
}

function CodeEmail({
  codeCommune,
  emailSelected,
  setEmailSelected,
  handleStrategy,
}: CodeEmailProps) {
  const t = useTranslations("habilitation.codeEmail");
  const [emailsCommune, setEmailsCommune] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEmailsCommune() {
      setIsLoading(true);
      const emails = await ApiDepotService.getEmailsCommune(codeCommune);
      setEmailsCommune(emails);
      if (emails.length > 0) {
        setEmailSelected(emails[0]);
      }
      setIsLoading(false);
    }

    fetchEmailsCommune();
  }, [codeCommune, setEmailSelected]);

  const isValidEmailSelected = useMemo(() => {
    return isEmail(emailSelected);
  }, [emailSelected]);

  if (isLoading) {
    return (
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        <Spinner />
      </Pane>
    );
  }

  return (
    <>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h5">{t("title")}</Heading>

        {emailsCommune.length === 1 && (
          <Text height={40} verticalAlign="middle" paddingTop={8}>
            <Strong whiteSpace="nowrap">{emailSelected}</Strong>
          </Text>
        )}
        {emailsCommune.length > 1 && (
          <SelectField
            marginTop={0}
            marginBottom={0}
            value={emailSelected}
            onChange={({ target }) => {
              setEmailSelected(target.value);
            }}
          >
            {emailsCommune.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </SelectField>
        )}
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={16}
        marginBottom={32}
      >
        <Button
          disabled={!emailSelected || !isValidEmailSelected}
          cursor={emailSelected ? "pointer" : "not-allowed"}
          appearance="primary"
          onClick={handleStrategy}
          width={214}
          height={56}
          borderRadius={0}
          lineHeight="18px"
          iconBefore={<EnvelopeIcon size={40} />}
        >
          <Text
            whiteSpace="pre-line"
            color="white"
            fontSize={16}
            textAlign="left"
          >
            {t("receiveCode")}
          </Text>
        </Button>
      </Pane>

      {isValidEmailSelected ? <TextValidEmail /> : <TextInvalidEmail />}
    </>
  );
}

export default CodeEmail;
