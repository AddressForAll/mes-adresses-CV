import { Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import helpTags from "@/components/help/tags";

interface UnauthorizedProps {
  title: string;
}

function Unauthorized({ title }: UnauthorizedProps) {
  const t = useTranslations("help.unauthorized");

  return (
    <Tuto title={title}>
      <Paragraph marginTop="default">{t.rich("readOnly", helpTags)}</Paragraph>
      <Paragraph marginTop="default">{t.rich("fix", helpTags)}</Paragraph>
    </Tuto>
  );
}

export default Unauthorized;
