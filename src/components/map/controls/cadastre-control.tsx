import { Tooltip, Button, ControlIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface CadastreControlProps {
  hasCadastre?: boolean;
  isCadastreDisplayed?: boolean;
  onClick: () => void;
}

function CadastreControl({
  hasCadastre,
  isCadastreDisplayed,
  onClick,
}: CadastreControlProps) {
  const t = useTranslations("mapControls");
  return hasCadastre ? (
    <Tooltip
      content={isCadastreDisplayed ? t("hideCadastre") : t("showCadastre")}
    >
      <Button
        style={{ padding: ".8em" }}
        onClick={onClick}
        title={isCadastreDisplayed ? t("hideCadastre") : t("showCadastre")}
        {...(isCadastreDisplayed && {
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
        })}
      >
        <ControlIcon color={isCadastreDisplayed ? "selected" : "muted"} />
      </Button>
    </Tooltip>
  ) : (
    <Tooltip content={t("cadastreUnavailable")}>
      <Button
        style={{ padding: ".8em" }}
        cursor="not-allowed"
        title={t("cadastreUnavailable")}
      >
        <ControlIcon color="muted" />
      </Button>
    </Tooltip>
  );
}

export default CadastreControl;
