import NewPageComponent from "@/components/new";
import { ApiGeoService } from "../../lib/geo-api";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { BALWidgetConfig } from "@/lib/bal-admin/type";
import { CommuneService } from "@/lib/openapi-api-bal";
import { getTerritoryCodeCountry } from "@/lib/countries";

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  let defaultCommune = null;
  const query = await searchParams;
  if (query.commune && getTerritoryCodeCountry(query.commune)) {
    // Not a French commune: our API knows the territory catalogs.
    try {
      defaultCommune = await CommuneService.findCommune(query.commune);
    } catch {
      defaultCommune = null;
    }
  } else if (query.commune) {
    defaultCommune = await ApiGeoService.getCommune(query.commune, {
      fields: "departement",
    });
  }
  let outdatedApiDepotClients: string[] = [];
  let outdatedHarvestSources: string[] = [];
  try {
    const widgetConfig: BALWidgetConfig =
      await ApiBalAdminService.getBALWidgetConfig();
    outdatedApiDepotClients =
      widgetConfig?.communes?.outdatedApiDepotClients || [];
    outdatedHarvestSources =
      widgetConfig?.communes?.outdatedHarvestSources || [];
  } catch (error) {
    console.error("Error fetching widget config:", error);
  }

  return (
    <NewPageComponent
      defaultCommune={defaultCommune}
      outdatedApiDepotClients={outdatedApiDepotClients}
      outdatedHarvestSources={outdatedHarvestSources}
    />
  );
}
