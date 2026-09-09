import { useContext } from "react";
import { Heading, Pane, Text, IconButton, EditIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";
import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi-api-bal";
import LanguagePreview from "../bal/language-preview";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";
import BALRecoveryContext from "@/contexts/bal-recovery";

interface BALSummaryProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
  toponymes: ExtentedToponymeDTO[];
  communeFlag: string;
  onEditNomsAlt: () => void;
}

function BALSummary({
  baseLocale,
  commune,
  voies,
  toponymes,
  communeFlag,
  onEditNomsAlt,
}: BALSummaryProps) {
  const t = useTranslations("balSummary");
  const { otherBalIdPublished } = useContext(BALRecoveryContext);
  const { token } = useContext(TokenContext);
  const { isEditing } = useContext(BalDataContext);
  const { nbNumeros } = baseLocale;

  return (
    <Pane
      display="flex"
      flexDirection="column"
      backgroundColor="white"
      padding={16}
    >
      <Heading
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Pane display="flex" alignItems="center">
          <Pane
            height={40}
            width={40}
            flexShrink={0}
            backgroundImage={`url(${communeFlag})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
            marginRight={8}
          />
          {commune.nom} - {commune.code}
        </Pane>
        {!isEditing && token && !Boolean(otherBalIdPublished) && (
          <IconButton
            icon={EditIcon}
            marginTop={-4}
            onClick={onEditNomsAlt}
            title={t("editNomsAlt")}
          />
        )}
      </Heading>
      <Pane marginLeft={40} marginY={8}>
        {baseLocale.communeNomsAlt && (
          <LanguagePreview nomsAlt={baseLocale.communeNomsAlt} />
        )}
      </Pane>
      <Pane display="flex" alignItems="center" gap={8}>
        {voies && (
          <Text>
            {t.rich("voiesCount", {
              count: voies.length,
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Text>
        )}
        {toponymes && (
          <Text>
            {t.rich("toponymesCount", {
              count: toponymes.length,
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Text>
        )}
        <Text>
          {t.rich("numerosCount", {
            count: nbNumeros,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </Text>
      </Pane>
    </Pane>
  );
}

export default BALSummary;
