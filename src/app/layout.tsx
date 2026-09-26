import type { Metadata } from "next";
import { extractStyles } from "evergreen-ui";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { LayoutContextProvider } from "@/contexts/layout";
import { LocalStorageContextProvider } from "@/contexts/local-storage";
import { CountryContextProvider } from "@/contexts/country";
import { HelpContextProvider } from "@/contexts/help";
import Help from "@/components/help";
import { initialOpenAPIBaseURL } from "@/lib/open-api";
import Main from "@/layouts/main";
import { BALRecoveryProvider } from "@/contexts/bal-recovery";
import { OpenAPIContextProvider } from "@/contexts/open-api";

import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

initialOpenAPIBaseURL();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { css, hydrationScript } = extractStyles();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} data-color-scheme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <style id="evergreen-css" dangerouslySetInnerHTML={{ __html: css }} />
        {hydrationScript}
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OpenAPIContextProvider>
            <LayoutContextProvider>
              <LocalStorageContextProvider>
                <CountryContextProvider>
                  <HelpContextProvider>
                    <BALRecoveryProvider>
                      <Help />
                      <Main>{children}</Main>
                    </BALRecoveryProvider>
                  </HelpContextProvider>
                </CountryContextProvider>
              </LocalStorageContextProvider>
            </LayoutContextProvider>
          </OpenAPIContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
