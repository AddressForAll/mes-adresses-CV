"use client";
import { useRouter } from "next/navigation";
import { Button, Dialog, Heading, Link, Pane, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { BaseLocale } from "@/lib/openapi-api-bal";

interface RecoverPublishedBALAlertProps {
  isShown: boolean;
  baseLocale?: BaseLocale;
  otherBalIdPublished: string;
  onClose: () => void;
}

function RecoverPublishedBALAlert({
  isShown,
  otherBalIdPublished,
  onClose,
}: RecoverPublishedBALAlertProps) {
  const t = useTranslations("balRecovery");
  const router = useRouter();
  const handleComplete = () => {
    onClose();
  };

  const handleGoToBAL = () => {
    onClose();
    router.push(`/bal/${otherBalIdPublished}`);
  };

  return (
    <Dialog
      isShown={isShown}
      width={500}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={() => handleComplete()}
    >
      <Pane
        background="gray300"
        marginX="-32px"
        marginY="-8px"
        borderRadius={8}
        padding={16}
      >
        <Pane background="white" borderRadius={8} padding={16}>
          <Heading is="h2" textAlign="center">
            {t("alreadyPublishedTitle")}
          </Heading>
        </Pane>
        <Pane background="white" borderRadius={8} padding={16} marginTop={16}>
          <Text is="p">{t("mustStartFromPublished")}</Text>
          <Button height={30} onClick={handleGoToBAL} marginTop={8}>
            {t("goToPublished")}
          </Button>
          <Text is="p" marginTop={24}>
            {t("contactSupport")}{" "}
            <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
          </Text>
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default RecoverPublishedBALAlert;
