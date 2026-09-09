import {
  Alert,
  Button,
  ListItem,
  OrderedList,
  Pane,
  Paragraph,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import StatusBadge from "@/components/status-badge";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";
import { BaseLocale, BaseLocaleSync } from "@/lib/openapi-api-bal";

function Publication() {
  const t = useTranslations("help.publication");

  // Inline markup for the help copy — see base-locale.tsx for the rationale.
  const tags = {
    publishButton: (chunks: React.ReactNode) => (
      <Button marginX={4} height={24} appearance="primary">
        {chunks}
      </Button>
    ),
    successButton: (chunks: React.ReactNode) => (
      <Button marginX={4} height={24} appearance="primary" intent="success">
        {chunks}
      </Button>
    ),
    dangerButton: (chunks: React.ReactNode) => (
      <Button appearance="primary" intent="danger" height={24} marginX={4}>
        {chunks}
      </Button>
    ),
  };

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/oMKnhiVycDTjddCBXZuYMB`}
      />
      <Tuto title={t("publish.title")}>
        <OrderedList margin={8}>
          <ListItem>
            <Paragraph>{t.rich("publish.step1", tags)}</Paragraph>
          </ListItem>

          <ListItem>
            <Paragraph>{t("publish.step2")}</Paragraph>
          </ListItem>

          <ListItem>{t.rich("publish.step3", tags)}</ListItem>
        </OrderedList>
        <Alert title={t("conflict.title")}>
          <Text display="block" color="muted">
            {t("conflict.explanation")}
          </Text>
          <Text display="block" marginTop={8} color="muted">
            {t.rich("conflict.force", tags)}
          </Text>
        </Alert>
      </Tuto>

      <Tuto title={t("syncStatuses.title")}>
        <Pane display="flex" flexDirection="column" gap={16} marginTop={8}>
          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: false, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncStatuses.synced")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{
                  isPaused: false,
                  status: BaseLocaleSync.status.OUTDATED,
                }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncStatuses.outdated")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: true, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncStatuses.paused")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.REPLACED}
                sync={{
                  isPaused: true,
                  status: BaseLocaleSync.status.CONFLICT,
                }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncStatuses.replaced")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={38}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{
                  isPaused: false,
                  status: BaseLocaleSync.status.OUTDATED,
                }}
                isHabilitationValid={false}
              />
            </Pane>
            <Text>{t("syncStatuses.noHabilitation")}</Text>
          </Pane>
        </Pane>
      </Tuto>

      <Problems>
        <Unauthorized title={t("problems.cannotEdit")} />
      </Problems>
    </Pane>
  );
}

export default Publication;
