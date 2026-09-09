import React, { useEffect, useState } from "react";
import {
  Card,
  Pane,
  Heading,
  Text,
  EyeOffIcon,
  TrashIcon,
  ArrowRightIcon,
  Pulsar,
  Icon,
} from "evergreen-ui";
import { useFormatter, useTranslations } from "next-intl";
import NextLink from "next/link";
import StatusBadge from "@/components/status-badge";
import {
  BaseLocale,
  BaseLocaleWithHabilitationDTO,
} from "@/lib/openapi-api-bal";
import CertificationCount from "../certification-count";
import { canFetchSignalements } from "@/lib/utils/signalement";
import { ReportsService, Signalement } from "@/lib/openapi-signalement";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import styles from "./base-locale-card.module.css";
import { TabsEnum } from "../sidebar/main-tabs/main-tabs";

interface BaseLocaleCardProps {
  baseLocale: BaseLocaleWithHabilitationDTO & { token: string };
  onRemove: () => void;
}

function BaseLocaleCard({ baseLocale, onRemove }: BaseLocaleCardProps) {
  const t = useTranslations("baseLocaleCard");
  const format = useFormatter();
  const [pendingSignalementsCount, setPendingSignalementsCount] = useState(0);
  const [flag, setFlag] = useState<string | null>(null);
  const { id, status, sync, nom, updatedAt, nbNumeros, nbNumerosCertifies } =
    baseLocale;

  useEffect(() => {
    const fetchCommuneFlag = async () => {
      try {
        const flagUrl = await getCommuneFlagProxy(baseLocale.commune);
        setFlag(flagUrl);
      } catch (err) {
        console.error("Error fetching commune flag", err);
        setFlag(null);
      }
    };

    const fetchPendingSignalementsCount = async () => {
      try {
        const paginatedSignalements = await ReportsService.getReports(
          1,
          undefined,
          undefined,
          [Signalement.status.PENDING],
          undefined,
          [baseLocale.commune]
        );
        setPendingSignalementsCount(paginatedSignalements.total);
      } catch (err) {
        console.error("Error fetching pending signalements count", err);
        setPendingSignalementsCount(0);
      }
    };

    fetchCommuneFlag();
    if (
      canFetchSignalements(
        baseLocale as unknown as BaseLocale,
        baseLocale.token
      )
    ) {
      fetchPendingSignalementsCount();
    }
  }, [baseLocale]);

  // Locale-aware relative time — `formatDistanceToNow` from date-fns would
  // need a separate locale object bundled per supported language.
  const majDate = format.relativeTime(new Date(updatedAt));

  const canHardDelete =
    status === BaseLocaleWithHabilitationDTO.status.DRAFT ||
    status === BaseLocaleWithHabilitationDTO.status.DEMO;

  return (
    <Card
      position="relative"
      display="flex"
      flexDirection="column"
      width={290}
      height={400}
      border
      elevation={2}
      margin={12}
    >
      <Pane position="absolute" top={16} left={16} height={20} elevation={2}>
        <StatusBadge
          status={status}
          sync={sync}
          isHabilitationValid={baseLocale.isHabilitationValid}
        />
      </Pane>
      <Pane
        height={100}
        flexShrink={0}
        backgroundImage={`url(${flag})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        marginTop={50}
        marginX={10}
      />
      <Pane
        padding={10}
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
      >
        <Pane display="flex" flexDirection="column">
          <Heading is="h2" size={600}>
            {nom}
          </Heading>
          <Text fontSize={12} fontStyle="italic">
            {updatedAt
              ? t("lastUpdate", { relative: majDate })
              : t("neverUpdated")}{" "}
          </Text>
        </Pane>
        <Pane display="flex" flexDirection="column">
          <Pane marginTop={5} display="flex">
            <Text display="block" marginRight={5}>
              {t("certifiedAddresses")}
            </Text>
            <CertificationCount
              nbNumeros={nbNumeros}
              nbNumerosCertifies={nbNumerosCertifies}
            />
          </Pane>
          {pendingSignalementsCount > 0 && (
            <Pane marginTop={5} display="flex">
              <Text display="block" marginRight={5}>
                Signalements en attente :
              </Text>
              <Text fontWeight="bold" whiteSpace="nowrap">
                {pendingSignalementsCount}
              </Text>
              <Pane marginLeft={35} position="relative">
                <Pulsar size={16} right={0} top={0} />
              </Pane>
            </Pane>
          )}
        </Pane>
      </Pane>
      <Pane
        width="100%"
        height={50}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderTop="1px solid #E4E7EB"
      >
        {canHardDelete && (
          <button
            onClick={onRemove}
            className={`${styles["custom-button"]} ${styles["delete-button"]}`}
            title={t("deleteBal")}
          >
            <Icon icon={TrashIcon} />
          </button>
        )}
        {!canHardDelete && (
          <button
            onClick={onRemove}
            className={`${styles["custom-button"]} ${styles["hide-button"]}`}
            title={t("hideBal")}
          >
            <Icon icon={EyeOffIcon} />
          </button>
        )}
        <Pane borderLeft="1px solid #E6E8F0" height="100%" />

        <NextLink
          href={`/bal/${id}/${TabsEnum.VOIES}`}
          className={`${styles["custom-button"]} ${styles["manage-button"]}`}
          title={t("openBal")}
        >
          <Text fontSize={16} fontWeight={300} color="inherit">
            {t("manageAddresses")}
          </Text>
          <Icon marginLeft={10} icon={ArrowRightIcon} />
        </NextLink>
      </Pane>
    </Card>
  );
}

export default BaseLocaleCard;
