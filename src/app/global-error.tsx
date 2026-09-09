"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import {
  Pane,
  Button,
  Icon,
  RouteIcon,
  Heading,
  ArrowLeftIcon,
} from "evergreen-ui";
import Main from "@/layouts/main";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";

/**
 * `global-error` replaces the root layout when it renders, so it sits *outside*
 * `NextIntlClientProvider` and cannot call `useTranslations`. These two strings
 * are therefore inlined per locale, read from the same NEXT_LOCALE cookie the
 * server uses — a full catalog import here would also mean shipping every
 * message in the error bundle.
 */
const MESSAGES: Record<Locale, { title: string; retry: string }> = {
  fr: { title: "Une erreur est survenue.", retry: "Réessayer" },
  en: { title: "An error occurred.", retry: "Try again" },
  es: { title: "Se ha producido un error.", retry: "Reintentar" },
};

function readLocale(): Locale {
  if (typeof document === "undefined") {
    return DEFAULT_LOCALE;
  }
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  return isLocale(match?.[1]) ? (match[1] as Locale) : DEFAULT_LOCALE;
}

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  const messages = MESSAGES[readLocale()];

  const reload = () => {
    window.location.reload();
  };

  return (
    <Main>
      <Pane
        display="flex"
        flex={1}
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        height="50%"
      >
        <Icon
          icon={RouteIcon}
          size={100}
          marginX="auto"
          marginY={16}
          color="#101840"
        />
        <Heading size={800} marginBottom="2em">
          {messages.title}
        </Heading>
        <Button iconBefore={ArrowLeftIcon} onClick={reload}>
          {messages.retry}
        </Button>
      </Pane>
    </Main>
  );
}
