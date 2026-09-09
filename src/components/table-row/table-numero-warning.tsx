import { ExtendedBaseLocaleDTO, Numero } from "@/lib/openapi-api-bal";
import { AlertNumero } from "@/lib/alerts/alerts.types";
import {
  isAlertNumeroParcelle,
  isAlertNumeroSuffixe,
} from "@/lib/alerts/utils/alerts-numero.utils";
import WarningNumero from "./alerts-warning/warning-numero";
import { Li, majorScale, Menu, Pane, Ul } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface TableNumeroWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  alerts: AlertNumero[];
  numero?: Numero;
  onSelect: () => void;
}

function TableNumeroWarning({ alerts, onSelect }: TableNumeroWarningProps) {
  const t = useTranslations("warnings");
  const multiAlertsNumeroParcelle =
    alerts.filter((alert) => isAlertNumeroParcelle(alert)).length > 1;

  const data = multiAlertsNumeroParcelle
    ? alerts.filter((alert) => !isAlertNumeroParcelle(alert))
    : alerts;

  return (
    <Menu>
      <Ul listStyle="none" paddingRight={16}>
        <Li>
          {multiAlertsNumeroParcelle ? (
            <WarningNumero
              title={t("parcellesMissing")}
              goToFormNumero={onSelect}
            />
          ) : null}
        </Li>
        {data.map((alert, index) => {
          return (
            <Li key={`alert-${index}`}>
              {index > 0 && (
                <Pane borderTop={true} marginRight={majorScale(2)} />
              )}
              {isAlertNumeroSuffixe(alert) ? (
                <WarningNumero
                  title={t("suffixeIncorrect")}
                  goToFormNumero={onSelect}
                />
              ) : null}
              {!multiAlertsNumeroParcelle && isAlertNumeroParcelle(alert) ? (
                <WarningNumero
                  title={t("parcelleMissing")}
                  goToFormNumero={onSelect}
                />
              ) : null}
            </Li>
          );
        })}
      </Ul>
    </Menu>
  );
}

export default TableNumeroWarning;
