import { AlertCodeNumeroEnum, AlertCodeVoieEnum } from "./alerts.types";

/**
 * Alert codes in display order.
 *
 * The wording lives in the `alertDefinitions` catalog namespace, keyed by the
 * enum's own value (`caractere_invalide`, …) — those values are already stable
 * identifiers, so a code doubles as its catalog key: `t(code)`.
 */
export const AlertVoieCodes: AlertCodeVoieEnum[] = [
  AlertCodeVoieEnum.CARACTERE_INVALIDE,
  AlertCodeVoieEnum.CARACTERE_INVALIDE_START_OR_END,
  AlertCodeVoieEnum.CARACTERE_INVALIDE_END,
  AlertCodeVoieEnum.NO_WORDS_IN_PARENTHESES,
  AlertCodeVoieEnum.MULTI_SPACE_CARACTERE,
  AlertCodeVoieEnum.BAD_WORD_LIEUDIT,
  AlertCodeVoieEnum.BAD_MULTI_WORD_RUE,
  AlertCodeVoieEnum.ABBREVIATION_INVALID,
  AlertCodeVoieEnum.CASSE_INCORRECTE,
  AlertCodeVoieEnum.LAKE_OF_ACCENT,
  AlertCodeVoieEnum.VOIE_EMPTY,
  AlertCodeVoieEnum.DOUBLON_VOIE_NOM,
];

export const AlertNumeroCodes: AlertCodeNumeroEnum[] = [
  AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE,
  AlertCodeNumeroEnum.PARCELLE_NOT_EXIST,
];
