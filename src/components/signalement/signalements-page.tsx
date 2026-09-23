"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Pane,
  Paragraph,
  Tab,
  Tablist,
  TrashIcon,
  Text,
  Badge,
} from "evergreen-ui";
import { useTranslations, useLocale } from "next-intl";
import SignalementList from "@/components/signalement/signalement-list";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedPage from "@/layouts/protected-page";
import { Report, Signalement } from "@/lib/openapi-signalement";
import MarkersContext from "@/contexts/markers";
import { getSignalementLabel } from "@/lib/utils/signalement";
import LayoutContext from "@/contexts/layout";
import SignalementTypeBadge, {
  signalementTypeMap,
} from "@/components/signalement/signalement-type-badge";
import useFuse from "@/hooks/fuse";
import MapContext from "@/contexts/map";
import SignalementContext from "@/contexts/signalement";
import BalDataContext from "@/contexts/bal-data";
import { PurgeExpiredSignalementsDialog } from "@/components/signalement/purge-expired-signalements-dialog";
import { TilesLayerMode } from "@/components/map/layers/tiles";

const fuseOptions = {
  keys: ["label"],
};

interface SignalementsPageProps {
  paginatedReports: { data: Report[] };
}

export default function SignalementsPage({
  paginatedReports: initialReports,
}: SignalementsPageProps) {
  const t = useTranslations("signalementsPage");
  const tt = useTranslations("signalementTypes");
  const locale = useLocale();
  const tc = useTranslations("common");
  const { commune, baseLocale } = useContext(BalDataContext);
  const [signalements, setSignalements] = useState<Report[]>(
    initialReports.data
  );
  const {
    pendingSignalementsCount,
    archivedSignalementsCount,
    updateManySignalements,
    fetchPendingSignalements,
    fetchArchivedSignalements,
  } = useContext(SignalementContext);
  const [selectedSignalements, setSelectedSignalements] = useState<string[]>(
    []
  );
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [
    showPurgeExpiredSignalementsModal,
    setShowPurgeExpiredSignalementsDialog,
  ] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const { map, setTileLayersMode } = useContext(MapContext);
  const [activeTabIndex, setActiveTabIndex] = useState(
    searchParams.get("tab") === "archived" ? 1 : 0
  );
  const [filters, setFilters] = useState<{ type: Report.type[] }>({
    type: [],
  });

  const tabs = [
    { label: t("tabPending"), key: "pending", count: pendingSignalementsCount },
    {
      label: t("tabArchived", { count: archivedSignalementsCount }),
      key: "archived",
      count: archivedSignalementsCount,
    },
  ];

  useEffect(() => {
    setBreadcrumbs(<Text aria-current="page">{t("breadcrumb")}</Text>);
    setTileLayersMode(TilesLayerMode.HIDDEN);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, setTileLayersMode]);

  // Fly to commune
  useEffect(() => {
    if (!map) {
      return;
    }

    if (commune.bbox) {
      const center = [
        (commune.bbox[0] + commune.bbox[2]) / 2,
        (commune.bbox[1] + commune.bbox[3]) / 2,
      ] as [number, number];
      map.flyTo({
        center,
        offset: [0, 0],
        zoom: 12,
        screenSpeed: 2,
      });
    }
  }, [commune.bbox, map]);

  useEffect(() => {
    const updateSignalements = async () => {
      setSelectedSignalements([]);
      let signalements;
      if (activeTabIndex === 0) {
        signalements = await fetchPendingSignalements(
          100,
          filters.type as Report.type[]
        );
      } else {
        signalements = await fetchArchivedSignalements(
          100,
          filters.type as Report.type[]
        );
      }
      setSignalements(signalements);
    };

    updateSignalements();
  }, [
    filters,
    activeTabIndex,
    fetchPendingSignalements,
    fetchArchivedSignalements,
  ]);

  const signalementsWithLabel = useMemo(
    () =>
      signalements.map((s) => ({
        ...s,
        label: getSignalementLabel(s, {
          locale,
          missingAddressLabel: tt("missingAddress"),
        }),
      })),
    [signalements, locale, tt]
  );

  const [signalementsList, setSignalementsList] = useFuse(
    signalementsWithLabel,
    200,
    fuseOptions
  );

  const handleSelectSignalement = useCallback(
    (id) => {
      router.push(`/bal/${baseLocale.id}/signalements/${id}`);
    },
    [router, baseLocale.id]
  );

  useEffect(() => {
    const markerPositions = signalementsList
      .filter((signalement) => signalement.point)
      .map(({ id, point, label, type }) => {
        return {
          id,
          isMapMarker: true,
          tooltip: (
            <Pane display="flex" flexDirection="column">
              <SignalementTypeBadge type={type} />
              <Text marginTop={5}>{label}</Text>
            </Pane>
          ),
          longitude: point.coordinates[0],
          latitude: point.coordinates[1],
          color: signalementTypeMap[type].color,
          onClick: () => {
            handleSelectSignalement(id);
          },
        };
      });

    markerPositions.forEach((position) => {
      addMarker(position);
    });

    return () => {
      disableMarkers();
    };
  }, [signalementsList, handleSelectSignalement]);

  const handleIgnoreSignalements = async (ids: string[]) => {
    const _updateSignalements = toaster(
      () => updateManySignalements(ids, Signalement.status.IGNORED),
      t("ignoredManyToast", { count: ids.length }),
      t("errorToast")
    );

    await _updateSignalements();
    const signalements = await fetchPendingSignalements(
      100,
      filters.type as Report.type[]
    );
    setSignalements(signalements);
  };

  const handleToggleSelect = (ids: string[]) => {
    for (const id of ids) {
      if (!selectedSignalements.includes(id)) {
        setSelectedSignalements([...selectedSignalements, id]);
      } else {
        setSelectedSignalements(selectedSignalements.filter((s) => s !== id));
      }
    }
  };

  const handleSelectTab = (index: number) => {
    setActiveTabIndex(index);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabs[index].key);

    router.replace(
      `/bal/${baseLocale.id}/signalements?${newSearchParams.toString()}`
    );
  };

  return (
    <ProtectedPage>
      <Pane
        background="white"
        padding={8}
        borderBottom="muted"
        textAlign="center"
      >
        <Text>{t("improvementRequests")}</Text>
      </Pane>
      <Tablist background="white" padding={8}>
        {tabs.map(({ label, key, count }, index) => (
          <Tab
            key={key}
            isSelected={activeTabIndex === index}
            onSelect={() => handleSelectTab(index)}
          >
            <Badge color="neutral" marginRight={4}>
              {count}
            </Badge>
            {label}
          </Tab>
        ))}
      </Tablist>

      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {selectedSignalements.length > 1 && (
          <Pane padding={16}>
            <Pane marginBottom={5}>
              <Heading>{t("bulkActions")}</Heading>
            </Pane>
            <Pane>
              <Dialog
                isShown={showWarningDialog}
                intent="success"
                title={t("confirmBulkAction")}
                hasFooter={false}
                onCloseComplete={() => setShowWarningDialog(false)}
              >
                <Pane marginX="-32px" marginBottom="-8px">
                  <Paragraph marginBottom={8} marginLeft={32} color="muted">
                    {t("confirmIgnoreQuestion")}
                  </Paragraph>
                </Pane>

                <Pane display="flex" justifyContent="flex-end">
                  <Button
                    marginRight={16}
                    appearance="primary"
                    onClick={async () => {
                      await handleIgnoreSignalements(selectedSignalements);
                      setShowWarningDialog(false);
                      setSelectedSignalements([]);
                    }}
                  >
                    {tc("confirm")}
                  </Button>
                  <Button
                    appearance="default"
                    onClick={() => setShowWarningDialog(false)}
                  >
                    {tc("cancel")}
                  </Button>
                </Pane>
              </Dialog>
              <Button
                marginLeft={16}
                iconBefore={TrashIcon}
                intent="danger"
                onClick={() => setShowWarningDialog(true)}
              >
                {t("ignoreSignalements")}
              </Button>
            </Pane>
          </Pane>
        )}
        <SignalementList
          signalements={signalementsList}
          selectedSignalements={selectedSignalements}
          onSelect={handleSelectSignalement}
          setSelectedSignalements={setSelectedSignalements}
          onToggleSelect={handleToggleSelect}
          onIgnore={(id) => handleIgnoreSignalements([id])}
          filters={filters}
          setFilters={setFilters}
          onSearch={setSignalementsList}
          editionEnabled={activeTabIndex === 0}
          onShowPurgeExpiredSignalementsDialog={() =>
            setShowPurgeExpiredSignalementsDialog(true)
          }
        />
      </Pane>
      <PurgeExpiredSignalementsDialog
        baseLocale={baseLocale}
        onClose={() => setShowPurgeExpiredSignalementsDialog(false)}
        isShown={showPurgeExpiredSignalementsModal}
      />
    </ProtectedPage>
  );
}
