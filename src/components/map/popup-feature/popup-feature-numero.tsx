import { useMemo, useContext } from "react";
import { Pane, Badge, Text, Strong } from "evergreen-ui";
import { useTranslations } from "next-intl";
import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";

interface PopupFeatureNumeroProps {
  feature: {
    geometry: {
      coordinates: number[];
    };
    properties: {
      idVoie: string;
      idToponyme?: string;
      numero?: number | null;
      numeroTexte?: string;
      numeroComplet: string;
      certifie: boolean;
      parcelles: string;
      suffixe: string;
      postalCode?: string;
    };
  };
  commune: CommuneType;
}

function PopupFeatureNumero({ feature, commune }: PopupFeatureNumeroProps) {
  const t = useTranslations("mapPopup");
  const { voies, toponymes } = useContext(BalDataContext);

  const getParcelles = useMemo(() => {
    return feature.properties?.parcelles
      ? JSON.parse(feature.properties?.parcelles)
      : [];
  }, [feature.properties]);

  const voie = voies.find((v) => v.id === feature.properties?.idVoie);

  const toponyme = toponymes.find(
    (t) => t.id === feature.properties?.idToponyme
  );

  return (
    <Pane display="flex" flexDirection="column">
      <Strong>
        {feature.properties.numeroComplet} {voie?.nom}
      </Strong>
      {toponyme && <Text is="i">{toponyme.nom}</Text>}
      <Text marginBottom="10px">
        {feature.properties.postalCode
          ? `${feature.properties.postalCode} - `
          : ""}
        {commune.nom}
      </Text>
      {feature.properties.certifie ? (
        <Badge color="green">{t("certified")}</Badge>
      ) : (
        <Badge color="yellow">{t("uncertified")}</Badge>
      )}
      {getParcelles.length > 0 && (
        <>
          <Strong marginTop="10px">{t("parcelles")}</Strong>
          {getParcelles.map((parcelle) => (
            <Badge key={parcelle} color="blue" marginTop={4}>
              {parcelle}
            </Badge>
          ))}
        </>
      )}
    </Pane>
  );
}

export default PopupFeatureNumero;
