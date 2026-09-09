import { Position } from "@/lib/openapi-api-bal";
import { PositionDTO, Signalement } from "@/lib/openapi-signalement";
import { getPositionTypeKey } from "@/lib/positions-types-list";
import {
  Heading,
  Pane,
  Small,
  Strong,
  Text,
  Badge,
  MinusIcon,
  PlusIcon,
} from "evergreen-ui";
import React from "react";
import { useTranslations } from "next-intl";

interface SignalementPositionProps {
  positions: PositionDTO[] | Position[];
  signalementType?: Signalement.type;
}

export function SignalementPosition({
  positions,
  signalementType,
}: SignalementPositionProps) {
  const t = useTranslations("positionTypes");
  const ts = useTranslations("signalement");

  return (
    <Pane marginTop={10} padding={8} borderRadius={8} className="glass-pane">
      <Text fontWeight="bold">
        {ts("positions", { count: positions.length })}
      </Text>
      <Pane display="grid" gridTemplateColumns="3fr 1fr 1fr" rowGap={6}>
        <Pane />
        <Strong fontWeight={200} fontSize="small">
          Lat
        </Strong>
        <Strong fontWeight={200} fontSize="small">
          Long
        </Strong>
        {positions.map(({ type, point }, index) => (
          <React.Fragment key={index}>
            {signalementType === Signalement.type.LOCATION_TO_CREATE ? (
              <Badge
                display="flex"
                alignItems="center"
                width="fit-content"
                size="small"
                marginY={2}
                color="teal"
              >
                <PlusIcon marginRight={4} />
                {t(getPositionTypeKey(type))}
              </Badge>
            ) : signalementType === Signalement.type.LOCATION_TO_DELETE ? (
              <Badge
                display="flex"
                alignItems="center"
                width="fit-content"
                size="small"
                marginY={2}
                color="orange"
              >
                <MinusIcon marginRight={4} />
                {t(getPositionTypeKey(type))}
              </Badge>
            ) : (
              <Badge width="fit-content" marginY={2} color="blue">
                {t(getPositionTypeKey(type))}
              </Badge>
            )}
            <Heading size={100} marginY="auto">
              <Small>{point.coordinates[1].toFixed(6)}</Small>
            </Heading>
            <Heading size={100} marginY="auto">
              <Small>{point.coordinates[0].toFixed(6)}</Small>
            </Heading>
          </React.Fragment>
        ))}
      </Pane>
    </Pane>
  );
}
