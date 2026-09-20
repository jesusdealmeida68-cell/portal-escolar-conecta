/**
 * Formatação determinística (igual no servidor e no navegador, sem depender
 * do fuso horário nem do locale instalado) para evitar diferenças de hidratação.
 */

const MESES_CURTOS = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "mai.",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];

/** "2026-09-20" → "20 set. 2026" */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return `${dia} ${MESES_CURTOS[(mes ?? 1) - 1]} ${ano}`;
}

/** 15.125 → "15,1" (uma casa decimal, vírgula). */
export function formatarMedia(valor: number): string {
  return valor.toFixed(1).replace(".", ",");
}

/** 25000 → "25 000 Kz" (espaços não separáveis). */
export function formatarKz(valor: number): string {
  const inteiro = Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${inteiro}\u00A0Kz`;
}

/** "Ana Beatriz Ferreira Domingos" → "AD" */
export function iniciais(nomeCompleto: string): string {
  const partes = nomeCompleto.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

/** "Ana Beatriz Ferreira Domingos" → "Ana Domingos" */
export function nomeCurto(nomeCompleto: string): string {
  const partes = nomeCompleto.trim().split(/\s+/);
  return partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : (partes[0] ?? "");
}
