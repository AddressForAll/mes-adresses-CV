import { CommuneSearchField } from "@/components/commune-search";
import TerritorySelector from "@/components/territory-selector/territory-selector";
import { CommuneType } from "@/types/commune";
import { Alert, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import CommunePublicationInfos from "../commune-publication-infos";
import CountryContext from "@/contexts/country";

interface SearchCommuneStepProps {
  commune: CommuneType | null;
  setCommune: (commune: CommuneType | null) => void;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
  onCreateNewBAL: (isDemoForce?: boolean) => void;
}

function SearchCommuneStep({
  commune,
  setCommune,
  outdatedApiDepotClients,
  outdatedHarvestSources,
  onCreateNewBAL,
}: SearchCommuneStepProps) {
  const t = useTranslations("searchCommuneStep");
  const [ref, setRef] = useState<HTMLInputElement>();
  const { country, countryProfile } = useContext(CountryContext);

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  if (!countryProfile.geoApi) {
    return (
      <Alert
        intent="none"
        title={t("noSearchTitle", { country: countryProfile.label })}
      >
        {t("noSearchContent")}
      </Alert>
    );
  }

  return (
    <Pane>
      {countryProfile.geoApi === "territories" ? (
        <Pane maxWidth={760} marginBottom={24}>
          <TerritorySelector
            // Remount on a country switch so no dropdown keeps the old
            // country's choices.
            key={country}
            country={country}
            levels={countryProfile.territoryLevels}
            commune={commune}
            setCommune={setCommune}
          />
        </Pane>
      ) : (
        <CommuneSearchField
          required
          innerRef={setRef}
          id="commune"
          initialSelectedItem={commune}
          label={t("label")}
          placeholder="Roche 42"
          appearance="default"
          maxWidth={500}
          onSelect={setCommune}
        />
      )}
      {commune && (
        <CommunePublicationInfos
          onCreateNewBAL={onCreateNewBAL}
          allowAutomaticProceed={countryProfile.geoApi === "fr"}
          commune={commune}
          outdatedApiDepotClients={outdatedApiDepotClients}
          outdatedHarvestSources={outdatedHarvestSources}
        />
      )}
    </Pane>
  );
}

export default SearchCommuneStep;
