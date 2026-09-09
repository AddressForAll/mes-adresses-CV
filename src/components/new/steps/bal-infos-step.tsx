import {
  Button,
  Pane,
  TextInputField,
  Text,
  Alert,
  Spinner,
  Switch,
  FormField,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import AdminEmailsField from "@/components/new/steps/admin-emails-field";

interface BALInfosStepProps {
  balName: string;
  setBalName: (name: string) => void;
  adminEmails: string[];
  setAdminEmails: (emails: string[]) => void;
  newEmailInput: string;
  setNewEmailInput: (email: string) => void;
  isLoading?: boolean;
  isDemoMode: boolean;
  setIsDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  forceDemoMode: boolean;
}

function BALInfosStep({
  balName,
  setBalName,
  adminEmails,
  setAdminEmails,
  newEmailInput,
  setNewEmailInput,
  isLoading,
  isDemoMode,
  setIsDemoMode,
  forceDemoMode,
}: BALInfosStepProps) {
  const t = useTranslations("balInfosStep");

  return (
    <Pane>
      <Pane maxWidth={600} display="flex" flexDirection="column">
        <TextInputField
          required
          autoComplete="one-time-code"
          name="nom"
          id="nom"
          value={balName}
          label={t("nom")}
          onChange={(e) => setBalName(e.target.value)}
          disabled={isLoading}
        />
        {!forceDemoMode && (
          <FormField
            display="flex"
            marginBottom={24}
            label={t("demoLabel")}
            description={t("demoDescription")}
          >
            <Switch
              marginLeft={8}
              checked={isDemoMode}
              onChange={() => setIsDemoMode(!isDemoMode)}
            />
          </FormField>
        )}
        {!forceDemoMode && !isDemoMode ? (
          <AdminEmailsField
            adminEmails={adminEmails}
            setAdminEmails={setAdminEmails}
            newEmailInput={newEmailInput}
            setNewEmailInput={setNewEmailInput}
          />
        ) : (
          ""
        )}
      </Pane>
      {isLoading && (
        <>
          <Alert title={t("creatingTitle")} intent="info" marginTop={16}>
            <Text marginTop={8}>{t("creatingContent")}</Text>
          </Alert>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex={1}
            marginTop={16}
          >
            <Spinner />
          </Pane>
        </>
      )}
    </Pane>
  );
}

export default BALInfosStep;
