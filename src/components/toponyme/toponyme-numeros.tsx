import React, { useState, useMemo, useCallback } from "react";
import { groupBy } from "lodash";
import {
  Heading,
  Table,
  EditIcon,
  Tooltip,
  CommentIcon,
  Position,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { Numero } from "@/lib/openapi-api-bal";

interface ToponymeNumerosProps {
  numeros: Numero[];
  handleSelect: (id: string) => void;
  isEditable: boolean;
}

function ToponymeNumeros({
  numeros,
  handleSelect,
  isEditable,
}: ToponymeNumerosProps) {
  const tc = useTranslations("common");
  const [hovered, setHovered] = useState(null);

  const numerosByVoie: Record<string, Numero[]> = useMemo(() => {
    return groupBy(
      numeros.sort((a, b) =>
        (a.numeroComplet || "").localeCompare(
          b.numeroComplet || "",
          undefined,
          {
            numeric: true,
          }
        )
      ),
      (d) => d.voie?.nom
    );
  }, [numeros]);

  const handleClick = useCallback(
    (id: string) => {
      if (isEditable) {
        handleSelect(id);
      }
    },
    [isEditable, handleSelect]
  );

  return (
    <>
      {Object.keys(numerosByVoie)
        .sort((a, b) => (a > b ? 1 : -1))
        .map((nomVoie) => (
          <React.Fragment key={nomVoie}>
            <Table.Cell style={{ padding: 0 }} backgroundColor="white">
              <Heading padding="1em" width="100%">
                {nomVoie}
              </Heading>
              <Table.TextCell flex="0 1 1">
                {tc("numerosCount", { count: numerosByVoie[nomVoie].length })}
              </Table.TextCell>
            </Table.Cell>

            {numerosByVoie[nomVoie].map(
              ({ id, numeroComplet, positions, comment }: Numero) => (
                <Table.Row
                  key={id}
                  style={{
                    cursor: "pointer",
                    backgroundColor: hovered === id ? "#E4E7EB" : "#f5f6f7",
                  }}
                  onMouseEnter={() => {
                    setHovered(id);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                  }}
                  onClick={() => {
                    handleClick(id);
                  }}
                >
                  <Table.Cell data-browsable>
                    <Table.TextCell data-editable flex="0 1 1">
                      {numeroComplet}{" "}
                      {hovered === id && isEditable && (
                        <EditIcon marginBottom={-4} marginLeft={8} />
                      )}
                    </Table.TextCell>
                  </Table.Cell>

                  {positions.length > 1 && (
                    <Table.TextCell flex="0 1 1">
                      {`${positions.length} positions`}
                    </Table.TextCell>
                  )}

                  {comment && (
                    <Table.Cell flex="0 1 1">
                      <Tooltip
                        content={comment}
                        position={Position.BOTTOM_RIGHT}
                      >
                        <CommentIcon color="muted" />
                      </Tooltip>
                    </Table.Cell>
                  )}
                </Table.Row>
              )
            )}
          </React.Fragment>
        ))}
    </>
  );
}

export default ToponymeNumeros;
