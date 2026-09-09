import { Pane, Text, Button, defaultTheme } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface WarningNumeroProps {
  title: string;
  goToFormNumero: () => void;
}

function WarningNumero({ title, goToFormNumero }: WarningNumeroProps) {
  const t = useTranslations("warnings");
  return (
    <>
      <Pane marginBottom={8}>
        <Text>{title}</Text>
      </Pane>
      <Button
        onClick={goToFormNumero}
        title={t("editNumero")}
        size="small"
        appearance="primary"
        style={{ backgroundColor: defaultTheme.colors.purple600 }}
      >
        Ameliorer
      </Button>
    </>
  );
}

export default WarningNumero;
