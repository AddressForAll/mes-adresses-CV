"use client";

import { BadgeSelect } from "@/components/badge-select";
import SignalementContext from "@/contexts/signalement";
import { Signalement } from "@/lib/openapi-signalement";
import {
  BanCircleIcon,
  Button,
  Label,
  Pane,
  Textarea,
  TickCircleIcon,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
import {
  rejectionReasons,
  RejectionReasonOption,
  OTHER_REJECTION_REASON,
} from "@/components/signalement/rejection-reasons";

interface SignalementFormButtonsProps {
  author?: Signalement["author"];
  isLoading: boolean;
  onAccept: () => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
  onClose: () => void;
}

export function SignalementFormButtons({
  author,
  isLoading,
  onAccept,
  onReject,
  onClose,
}: SignalementFormButtonsProps) {
  const t = useTranslations("signalementForm");
  const tr = useTranslations("rejectionReasons");
  const tc = useTranslations("common");
  const rejectionReasonOptions = rejectionReasons.map(({ value, key }) => ({
    value,
    label: tr(key),
  }));
  const { pendingSignalementsCount } = useContext(SignalementContext);
  const [rejectionReasonSelected, setRejectionReasonSelected] =
    useState<RejectionReasonOption | null>(null);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  return (
    <Pane
      position="sticky"
      bottom={-12}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      paddingY={10}
      backgroundColor="#e6e8f0"
      width="100%"
    >
      {showRejectionForm ? (
        <>
          <Pane
            background="white"
            padding={8}
            borderRadius={8}
            marginBottom={8}
            width="100%"
          >
            <Label htmlFor="reject-reason" marginBottom={8} display="block">
              <Text fontWeight="bold">{t("reason")}</Text>
              {author?.email && (
                <Text marginLeft={4} size={300} color="muted">
                  {t("authorWillBeEmailed")}
                </Text>
              )}
            </Label>
            <BadgeSelect
              options={rejectionReasonOptions}
              onChange={(value: string) =>
                setRejectionReasonSelected(value as RejectionReasonOption)
              }
              value={rejectionReasonSelected}
            />
            {rejectionReasonSelected === OTHER_REJECTION_REASON && (
              <Textarea
                id="reject-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t("reasonPlaceholder")}
                rows={4}
                resize="none"
              />
            )}
          </Pane>
          <Pane display="flex" flexDirection="column" width="100%">
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
            >
              <Pane
                margin={4}
                boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
              >
                <Button
                  isLoading={isLoading}
                  onClick={async () => {
                    await onReject(
                      rejectionReasonSelected === OTHER_REJECTION_REASON
                        ? rejectionReason
                        : rejectionReasonSelected
                    );
                    setShowRejectionForm(false);
                    setRejectionReason("");
                  }}
                  appearance="default"
                  intent="danger"
                  iconAfter={BanCircleIcon}
                >
                  {t("rejectAnd", { count: pendingSignalementsCount })}
                </Button>
              </Pane>
              <Pane
                margin={4}
                boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
              >
                <Button
                  disabled={isLoading}
                  type="button"
                  appearance="default"
                  display="inline-flex"
                  onClick={() => setShowRejectionForm(false)}
                >
                  {tc("cancel")}
                </Button>
              </Pane>
            </Pane>
          </Pane>
        </>
      ) : (
        <>
          <Pane
            margin={4}
            boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
          >
            <Button
              disabled={isLoading}
              onClick={async () => await onAccept()}
              appearance="primary"
              intent="success"
              iconAfter={TickCircleIcon}
            >
              {t("accept")}
            </Button>
          </Pane>

          <Pane
            margin={4}
            boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
          >
            <Button
              disabled={isLoading}
              type="button"
              appearance="default"
              intent="danger"
              display="inline-flex"
              onClick={() => setShowRejectionForm(true)}
              iconAfter={BanCircleIcon}
            >
              {t("reject")}
            </Button>
          </Pane>

          <Pane
            margin={4}
            boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
          >
            <Button
              disabled={isLoading}
              type="button"
              appearance="default"
              display="inline-flex"
              onClick={onClose}
            >
              {tc("back")}
            </Button>
          </Pane>
        </>
      )}
    </Pane>
  );
}
