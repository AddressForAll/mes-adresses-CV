import { Pane, Text } from "evergreen-ui";
import { uniqueId } from "lodash";
import { useTranslations } from "next-intl";

const COMMENTS_LIMIT = 10;

interface CommentsContentProps {
  mainComment?: string;
  commentedNumeros?: string[];
}

function CommentsContent({
  mainComment,
  commentedNumeros,
}: CommentsContentProps) {
  const t = useTranslations("comment");
  const filteredComments = commentedNumeros.slice(0, COMMENTS_LIMIT);
  const nbComments = commentedNumeros.length;
  const remainComments = nbComments - COMMENTS_LIMIT;

  return (
    <>
      <Pane marginBottom={8}>
        {mainComment ? (
          <Pane
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            color="white"
          >
            <Text color="white">{mainComment}</Text>
          </Pane>
        ) : (
          <Text color="white">
            {t("heading", { count: commentedNumeros.length })}
          </Text>
        )}
      </Pane>
      {filteredComments.map((comment) => (
        <Pane
          color="white"
          key={uniqueId()}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          <Text color="white">{comment}</Text>
        </Pane>
      ))}
      {nbComments > COMMENTS_LIMIT && (
        <Pane marginTop={8}>
          <Text color="white">
            {t("othersCount", { count: remainComments })}
          </Text>
        </Pane>
      )}
    </>
  );
}

export default CommentsContent;
