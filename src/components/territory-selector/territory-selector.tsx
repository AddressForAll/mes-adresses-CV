import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Pane,
  Paragraph,
  SelectField,
  Spinner,
  Strong,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import { TerritoriesService, TerritoryDTO } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";

interface TerritorySelectorProps {
  /** Country whose catalog to browse, e.g. "us". */
  country: string;
  /** Level keys, largest first — see CountryProfile.territoryLevels. */
  levels: string[];
  commune: CommuneType | null;
  setCommune: (commune: CommuneType | null) => void;
}

/**
 * A territory becomes the BAL's commune. The capability flags describe French
 * services (cadastre, IGN styles…), none of which exist for these territories.
 */
function toCommune(territory: TerritoryDTO): CommuneType {
  return {
    code: territory.code,
    nom: territory.nom,
    bbox: territory.bbox,
    codeCommunesCadastre: [],
    communesDeleguees: [],
    isCOM: false,
    hasCadastre: false,
    hasOpenMapTiles: false,
    hasOrtho: false,
    hasPlanIGN: false,
  };
}

/**
 * Cascading dropdowns replacing the French free-text commune search for
 * countries with a territory catalog (state → county → place for the US).
 *
 * The codes come from Overture divisions, the same ids the CLI importer uses,
 * so picking Fresno County here yields `US-197cfe35` — the code of a
 * CLI-imported Fresno BAL — and the step's "a BAL already exists" check finds
 * it.
 */
function TerritorySelector({
  country,
  levels,
  commune,
  setCommune,
}: TerritorySelectorProps) {
  const t = useTranslations("territorySelector");
  // options[i] lists the choices of dropdown i; selected[i] is the choice.
  const [options, setOptions] = useState<TerritoryDTO[][]>([]);
  const [selected, setSelected] = useState<TerritoryDTO[]>([]);
  const [loadingLevel, setLoadingLevel] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  // Ignore responses from a superseded request (a fast re-selection).
  const requestId = useRef(0);

  const loadPath = useCallback(
    async (path: TerritoryDTO[]) => {
      const id = ++requestId.current;
      setHasError(false);
      setSelected(path);
      setOptions((current) => current.slice(0, path.length));

      const parent = path[path.length - 1];
      if (parent && !parent.hasChildren) {
        return;
      }

      setLoadingLevel(path.length);
      try {
        const children = await TerritoriesService.listTerritories(
          country,
          parent?.code
        );
        if (id === requestId.current) {
          setOptions((current) => [...current.slice(0, path.length), children]);
        }
      } catch {
        if (id === requestId.current) {
          setHasError(true);
        }
      } finally {
        if (id === requestId.current) {
          setLoadingLevel(null);
        }
      }
    },
    [country]
  );

  // First load, and re-hydration when the step opens with a commune already
  // chosen (`/new?commune=US-…`): rebuild every dropdown along its path.
  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      if (!commune?.code) {
        await loadPath([]);
        return;
      }
      try {
        const territory = await TerritoriesService.findTerritory(
          country,
          commune.code
        );
        const lists = await Promise.all(
          [undefined, ...territory.path].map((parent) =>
            TerritoriesService.listTerritories(country, parent)
          )
        );
        if (isCancelled) return;
        const path = [...territory.path, territory.code].map((code, i) =>
          lists[i].find((item) => item.code === code)
        );
        if (path.some((item) => !item)) {
          throw new Error(`Inconsistent territory path for ${commune.code}`);
        }
        setOptions(lists);
        setSelected(path);
        if (territory.hasChildren) {
          await loadPath(path);
        }
      } catch {
        // Unknown code: start from the top rather than show a dead end.
        if (!isCancelled) await loadPath([]);
      }
    };

    void init();
    return () => {
      isCancelled = true;
    };
    // Only on mount / country switch — later selections go through onSelect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const onSelect = (level: number, code: string) => {
    const parents = selected.slice(0, level);
    const territory = options[level]?.find((item) => item.code === code);
    const path = territory ? [...parents, territory] : parents;
    // The deepest choice decides — "Entire county" (empty value) falls back
    // to the county itself.
    const deepest = path[path.length - 1];
    setCommune(deepest?.selectable ? toCommune(deepest) : null);
    void loadPath(path);
  };

  const deepest = selected[selected.length - 1];

  return (
    <Pane>
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={16}
      >
        {levels.map((levelKey, level) => {
          const parent = selected[level - 1];
          const items = options[level] || [];
          const isLoading = loadingLevel === level;
          const levelLabel = t(`levels.${levelKey}`);
          // Below a selectable territory, "no choice" means "all of it".
          const emptyLabel = isLoading
            ? t("loading")
            : parent?.selectable
              ? t("entireTerritory", { name: parent.nom })
              : t("choose");

          if (level > 0 && !parent?.hasChildren && !isLoading) {
            return null;
          }

          return (
            <SelectField
              key={levelKey}
              label={levelLabel}
              value={selected[level]?.code || ""}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onSelect(level, event.target.value)
              }
              disabled={isLoading || items.length === 0}
              marginBottom={0}
            >
              <option value="">{emptyLabel}</option>
              {items.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.nom}
                </option>
              ))}
            </SelectField>
          );
        })}
      </Pane>

      {hasError && (
        <Alert marginTop={16} intent="danger" title={t("loadError")}>
          <Button
            marginTop={8}
            type="button"
            onClick={() => void loadPath(selected)}
          >
            {t("retry")}
          </Button>
        </Alert>
      )}

      {loadingLevel !== null && !hasError && (
        <Pane display="flex" alignItems="center" gap={8} marginTop={16}>
          <Spinner size={16} />
          <Text color="muted">{t("loading")}</Text>
        </Pane>
      )}

      {commune && deepest?.code === commune.code && (
        <Pane
          marginTop={16}
          padding={16}
          border
          borderRadius={8}
          background="white"
        >
          <Paragraph>
            <Strong>{selected.map((item) => item.nom).join(" › ")}</Strong>
          </Paragraph>
          <Text size={300} color="muted" display="block" marginTop={4}>
            {t("selectedLevel", { level: t(`levels.${deepest.level}`) })} ·{" "}
            {t("territoryCode", { code: commune.code })}
          </Text>
        </Pane>
      )}
    </Pane>
  );
}

export default TerritorySelector;
