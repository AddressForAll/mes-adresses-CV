import { Heading, Pane } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface ProblemsProps {
  children: React.ReactNode;
}

function Problems({ children }: ProblemsProps) {
  const t = useTranslations("help");

  return (
    <Pane
      borderLeft="default"
      float="left"
      marginBottom={8}
      padding={8}
      display="flex"
      flexDirection="column"
    >
      <Heading is="h2">{t("havingAProblem")}</Heading>
      <Pane margin={8}>{children}</Pane>
    </Pane>
  );
}

export default Problems;
