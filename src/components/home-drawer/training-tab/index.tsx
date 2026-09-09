import { trainingTypeMap } from "@/lib/bal-admin";
import { EventType } from "@/lib/bal-admin/type";
import { getFullDate } from "@/lib/utils/date";
import { useLocale, useTranslations } from "next-intl";
import { Badge, CalendarIcon, Heading, Icon, Pane, Text } from "evergreen-ui";

interface TrainingTabProps {
  nextTrainings: EventType[];
}

function TrainingTab({ nextTrainings }: TrainingTabProps) {
  const locale = useLocale();
  const t = useTranslations("homeDrawer");
  const tt = useTranslations("trainingTypes");
  return (
    <Pane display="flex" flexDirection="column">
      {nextTrainings.length === 0 && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
          padding={10}
        >
          <Text>{t("noTrainings")}</Text>
        </Pane>
      )}
      <Pane is="ul" listStyle="none" padding={0} margin={0}>
        {nextTrainings.length > 0 &&
          nextTrainings.map(
            ({ id, type, date, startHour, endHour, description }, index) => (
              <Pane
                key={id}
                is="li"
                display="flex"
                flexDirection="column"
                padding={10}
                gap={8}
                justifyContent="space-between"
                borderBottom={
                  index === nextTrainings.length - 1 ? "none" : "1px solid #ccc"
                }
              >
                <Badge color={trainingTypeMap[type].color} width="fit-content">
                  {tt(trainingTypeMap[type].key)}
                </Badge>
                <Heading display="flex" alignItems="center" size={400}>
                  <Icon icon={CalendarIcon} marginRight={5} />
                  <span>{getFullDate(new Date(date), locale)}</span>
                  <Pane marginX={5}>|</Pane>
                  <span>
                    {startHour} - {endHour}
                  </span>
                </Heading>
                <Text>{description}</Text>
              </Pane>
            )
          )}
      </Pane>
    </Pane>
  );
}

export default TrainingTab;
