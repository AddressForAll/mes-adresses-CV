/**
 * Reasons a report can be rejected.
 *
 * `value` is what gets sent to the signalement API and stored on the report —
 * it stays in French so previously stored reasons keep their meaning and so
 * the same record reads identically for every reviewer. Only `key`, which
 * addresses the `rejectionReasons` catalog namespace, drives what is shown.
 */
export const rejectionReasons = [
  { value: "Signalement non pertinent", key: "notRelevant" },
  { value: "Signalement en double", key: "duplicate" },
  { value: "Signalement déjà traité", key: "alreadyHandled" },
  { value: "Signalement mal positionné", key: "misplaced" },
  { value: "Signalement non conforme", key: "nonCompliant" },
  { value: "Autre", key: "other" },
] as const;

export type RejectionReasonOption = (typeof rejectionReasons)[number]["value"];

/** Sentinel for the free-text branch of the rejection form. */
export const OTHER_REJECTION_REASON: RejectionReasonOption = "Autre";

/** Catalog key for a stored reason, or `undefined` for free text. */
export const getRejectionReasonKey = (value: string): string | undefined =>
  rejectionReasons.find((reason) => reason.value === value)?.key;
