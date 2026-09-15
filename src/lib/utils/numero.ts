export const computeCompletNumero = (
  numero: number | string | null | undefined,
  suffixe?: string,
  numeroTexte?: string | null
) => {
  if (numero === null || numero === undefined || numero === "") {
    return numeroTexte === undefined ? null : numeroTexte?.trim() || "s/n";
  }
  if (suffixe && Number.isNaN(suffixe)) {
    return `${numero}${suffixe.toLowerCase()}`;
  }

  return `${numero}${suffixe ? ` ${suffixe.toLowerCase()}` : ""}`;
};
