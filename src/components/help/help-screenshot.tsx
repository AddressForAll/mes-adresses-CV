import Image from "next/image";
import { Pane } from "evergreen-ui";
import { useLocale, useTranslations } from "next-intl";

/**
 * Screenshots shown in the help panel, one set per locale under
 * `public/static/images/help/<locale>/`. They were captured at 2x from the
 * local stack; the sizes below are the CSS-pixel crops, which lets
 * next/image reserve the right box before the file loads.
 */
const SCREENSHOTS = {
  newTerritory: { file: "new-territory", width: 736, height: 380 },
  newImport: { file: "new-import", width: 736, height: 330 },
  newDetails: { file: "new-details", width: 736, height: 560 },
  publicBals: { file: "public-bals", width: 658, height: 334 },
  settings: { file: "settings", width: 620, height: 690 },
  voiesList: { file: "voies-list", width: 500, height: 440 },
  voieForm: { file: "voie-form", width: 500, height: 420 },
  numeroForm: { file: "numero-form", width: 500, height: 784 },
  downloads: { file: "downloads", width: 620, height: 250 },
};

export type HelpScreenshotName = keyof typeof SCREENSHOTS;

interface HelpScreenshotProps {
  name: HelpScreenshotName;
}

function HelpScreenshot({ name }: HelpScreenshotProps) {
  const locale = useLocale();
  const t = useTranslations("help.screenshots");
  const { file, width, height } = SCREENSHOTS[name];

  return (
    <Pane
      marginY={12}
      border="default"
      borderRadius={4}
      overflow="hidden"
      lineHeight={0}
    >
      <Image
        src={`/static/images/help/${locale}/${file}.webp`}
        alt={t(name)}
        width={width}
        height={height}
        // Already cropped and compressed; the optimizer would only re-encode.
        unoptimized
        style={{ width: "100%", height: "auto" }}
      />
    </Pane>
  );
}

export default HelpScreenshot;
