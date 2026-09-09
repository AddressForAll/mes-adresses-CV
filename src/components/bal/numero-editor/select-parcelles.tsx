import { useContext, useEffect } from "react";
import {
  Pane,
  Button,
  Badge,
  Alert,
  TrashIcon,
  ControlIcon,
  Text,
  defaultTheme,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import ParcellesContext from "@/contexts/parcelles";
import MapContext from "@/contexts/map";
import CadastreContext from "@/contexts/cadastre";

import InputLabel from "@/components/input-label";

interface SelectParcellesProps {
  initialParcelles: string[];
  isToponyme?: boolean;
}

function SelectParcelles({
  initialParcelles = [],
  isToponyme,
}: SelectParcellesProps) {
  const t = useTranslations("selectParcelles");
  const { isCadastreDisplayed, setIsCadastreDisplayed } =
    useContext(MapContext);
  const {
    highlightedParcelles,
    setHighlightedParcelles,
    setIsParcelleSelectionEnabled,
    hoveredParcelles,
    handleHoveredParcelles,
    handleParcelles,
  } = useContext(ParcellesContext);
  const { communeParcellesIds } = useContext(CadastreContext);
  const invalidParcelles = highlightedParcelles.filter(
    (p) => communeParcellesIds.length > 0 && !communeParcellesIds.includes(p)
  );

  useEffect(() => {
    setHighlightedParcelles(initialParcelles);
    setIsParcelleSelectionEnabled(true);

    return () => {
      setIsParcelleSelectionEnabled(false);
    };
  }, [setHighlightedParcelles, setIsParcelleSelectionEnabled]);

  return (
    <Pane display="flex" flexDirection="column">
      <InputLabel
        title={t("title")}
        help={isToponyme ? t("helpToponyme") : t("helpNumero")}
      />
      {highlightedParcelles.length > 0 ? (
        <Pane display="grid" gridTemplateColumns="1fr 1fr 1fr">
          {highlightedParcelles.map((parcelle) => {
            const isHovered = hoveredParcelles.some(
              ({ id }) => id === parcelle
            );
            const isInvalid = invalidParcelles.includes(parcelle);
            return (
              <Badge
                key={parcelle}
                isInteractive
                color={isHovered ? "red" : isInvalid ? "purple" : "green"}
                margin={4}
                onClick={() => handleParcelles([parcelle])}
                onMouseEnter={() => handleHoveredParcelles([parcelle])}
                onMouseLeave={() => handleHoveredParcelles([])}
              >
                {parcelle}
                {isHovered && (
                  <TrashIcon
                    marginLeft={4}
                    size={14}
                    color="danger"
                    verticalAlign="text-bottom"
                  />
                )}
              </Badge>
            );
          })}
        </Pane>
      ) : (
        <Pane>
          <Alert marginTop={8}>
            <Text>{isToponyme ? t("emptyToponyme") : t("emptyNumero")}</Text>
          </Alert>
        </Pane>
      )}

      {invalidParcelles.length > 0 && (
        <Alert
          background={defaultTheme.colors.purpleTint}
          borderColor={defaultTheme.colors.purple600}
          marginTop={8}
          hasIcon={false}
          padding={8}
        >
          <Text color={defaultTheme.colors.purple600}>
            {t("invalidParcelles", { count: invalidParcelles.length })}
          </Text>
        </Alert>
      )}

      <Button
        type="button"
        display="flex"
        justifyContent="center"
        marginTop={8}
        iconAfter={ControlIcon}
        onClick={() => setIsCadastreDisplayed(!isCadastreDisplayed)}
      >
        {isCadastreDisplayed ? t("hideCadastre") : t("showCadastre")}
      </Button>
    </Pane>
  );
}

export default SelectParcelles;
