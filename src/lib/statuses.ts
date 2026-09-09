import {
  TimeIcon,
  TickCircleIcon,
  PauseIcon,
  ErrorIcon,
  ManuallyEnteredDataIcon,
  LabTestIcon,
  IconComponent,
  EyeOpenIcon,
} from "evergreen-ui";

import { BaseLocale, BaseLocaleSync } from "./openapi-api-bal";

/**
 * Presentation of a BAL status. The user-facing wording lives in the
 * `balStatus` catalog namespace, keyed by `key` — this module stays free of
 * hardcoded copy so a status can be rendered in any language:
 * `t(\`${key}.label\`)`, `.title`, `.content`.
 */
type StatusType = {
  key: string;
  color:
    | "neutral"
    | "blue"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "purple";
  textColor?: string;
  intent?: string;
  icon: IconComponent;
};

const STATUSES: { [key: string]: StatusType } = {
  consultation: {
    key: "consultation",
    color: "yellow",
    intent: "none",
    icon: EyeOpenIcon,
  },
  paused: {
    key: "paused",
    color: "yellow",
    intent: "warning",
    icon: PauseIcon,
  },
  "no-habilitation": {
    key: "noHabilitation",
    color: "yellow",
    intent: "none",
    icon: TimeIcon,
  },
  outdated: {
    key: "outdated",
    color: "blue",
    intent: "none",
    icon: TimeIcon,
  },
  synced: {
    key: "synced",
    color: "green",
    intent: "success",
    icon: TickCircleIcon,
  },
  replaced: {
    key: "replaced",
    color: "red",
    intent: "danger",
    icon: ErrorIcon,
  },
  draft: {
    key: "draft",
    color: "neutral",
    icon: ManuallyEnteredDataIcon,
  },
  demo: {
    key: "demo",
    color: "orange",
    textColor: "black",
    intent: "danger",
    icon: LabTestIcon,
  },
};

export function computeStatus(
  balStatus: BaseLocale.status,
  sync: Partial<BaseLocaleSync>,
  isHabilitationValid: boolean
): StatusType {
  if (sync?.isPaused && balStatus !== BaseLocale.status.REPLACED) {
    return STATUSES.paused;
  }

  if (balStatus === BaseLocale.status.PUBLISHED && sync.status) {
    if (!isHabilitationValid) {
      return STATUSES["no-habilitation"];
    }
    return STATUSES[sync.status];
  }

  return STATUSES[balStatus];
}
