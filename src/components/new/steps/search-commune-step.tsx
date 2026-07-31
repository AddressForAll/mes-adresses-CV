import { CommuneSearchField } from "@/components/commune-search";
import { CommuneType } from "@/types/commune";
import { Alert, Pane } from "evergreen-ui";
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
  const [ref, setRef] = useState<HTMLInputElement>();
  const { countryProfile } = useContext(CountryContext);

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  if (!countryProfile.geoApi) {
    return (
      <Alert intent="none" title={`Aucune recherche de commune pour ${countryProfile.label}`}>
        Les Bases Adresses Locales pour ce pays sont créées avec
        l&apos;importeur Overture Maps, en ligne de commande — il n&apos;y a
        pas encore de recherche de commune pour cette création guidée.
      </Alert>
    );
  }

  return (
    <Pane>
      <CommuneSearchField
        required
        innerRef={setRef}
        id="commune"
        initialSelectedItem={commune}
        label="Rechercher une commune"
        placeholder="Roche 42"
        appearance="default"
        maxWidth={500}
        onSelect={setCommune}
      />
      {commune && (
        <CommunePublicationInfos
          onCreateNewBAL={onCreateNewBAL}
          commune={commune}
          outdatedApiDepotClients={outdatedApiDepotClients}
          outdatedHarvestSources={outdatedHarvestSources}
        />
      )}
    </Pane>
  );
}

export default SearchCommuneStep;
