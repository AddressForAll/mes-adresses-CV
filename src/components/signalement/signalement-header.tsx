/* eslint-disable react-hooks/purity */
import { Alert as AlertUI, Pane, Paragraph, Tooltip } from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import { Alert, Signalement, Source } from "@/lib/openapi-signalement";
import { getDuration, getLongFormattedDate } from "@/lib/utils/date";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getRejectionReasonKey } from "./rejection-reasons";

interface SignalementHeaderProps {
  signalement: Signalement | Alert;
  author?: Signalement["author"];
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

function getComment(signalement: Signalement | Alert): string | undefined {
  if ("changesRequested" in signalement) {
    return (signalement as Signalement).changesRequested.comment;
  }

  return (signalement as Alert).comment;
}

export function SignalementHeader({
  signalement,
  author,
}: SignalementHeaderProps) {
  const t = useTranslations("signalementHeader");
  const td = useTranslations("duration");
  const tr = useTranslations("rejectionReasons");
  const locale = useLocale();
  const { type, createdAt, source, status, updatedAt } = signalement;
  const rejectionReason =
    "rejectionReason" in signalement ? signalement.rejectionReason : undefined;
  const comment = getComment(signalement);
  const duration = getDuration(new Date(createdAt));
  // Stored reasons are canonical French strings (see rejection-reasons.ts);
  // show the reader's own wording when the stored value is one of the canned
  // options, and the free-text reason verbatim otherwise.
  const rejectionReasonKey = rejectionReason
    ? getRejectionReasonKey(rejectionReason)
    : undefined;

  return (
    <AlertUI
      hasIcon={false}
      title={<SignalementTypeBadge type={type} />}
      intent="info"
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
      flexShrink={0}
    >
      <Pane marginTop={8}>
        {Date.now() - new Date(createdAt).getTime() > MONTH_IN_MS ? (
          <Paragraph>
            {t.rich("submittedOn", {
              date: getLongFormattedDate(new Date(createdAt), locale),
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Paragraph>
        ) : (
          <Paragraph>
            {t.rich("submittedAgo", {
              duration: td(duration.unit, { count: duration.value }),
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Paragraph>
        )}
        {author && (
          <Paragraph>
            {t("by")}{" "}
            <b>
              {author.firstName} {author.lastName}
            </b>{" "}
            {author.email && (
              <a href={`mailto:${author.email}`}>{author.email}</a>
            )}
          </Paragraph>
        )}
        <Paragraph>
          {t("via")} <b>{source.nom}</b>
          {source.type === Source.type.PRIVATE ? (
            <Tooltip content={t("trustedSource")}>
              <Image
                src="/static/images/signalement/source-service-public.svg"
                alt={t("publicServiceIconAlt")}
                width={20}
                height={20}
                style={{
                  marginLeft: 5,
                  verticalAlign: "sub",
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip content={t("publicSource")}>
              <Image
                src="/static/images/signalement/source-grand-public.svg"
                alt={t("generalPublicIconAlt")}
                width={20}
                height={20}
                style={{
                  marginLeft: 5,
                  verticalAlign: "middle",
                }}
              />
            </Tooltip>
          )}
        </Paragraph>

        {comment && (
          <Paragraph marginTop={10}>
            {t("comment")} <b>{comment}</b>
          </Paragraph>
        )}

        {status === Signalement.status.PROCESSED && (
          <Paragraph marginTop={10}>
            {t.rich("acceptedOn", {
              date: getLongFormattedDate(new Date(updatedAt), locale),
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Paragraph>
        )}

        {status === Signalement.status.IGNORED && (
          <>
            <Paragraph marginTop={10}>
              {t.rich("rejectedOn", {
                date: getLongFormattedDate(new Date(updatedAt), locale),
                b: (chunks) => <b>{chunks}</b>,
              })}
            </Paragraph>

            {rejectionReason && (
              <Paragraph marginTop={10}>
                {t("reason")}{" "}
                <b>
                  {rejectionReasonKey
                    ? tr(rejectionReasonKey)
                    : rejectionReason}
                </b>
              </Paragraph>
            )}
          </>
        )}
      </Pane>
    </AlertUI>
  );
}
