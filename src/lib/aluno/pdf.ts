/**
 * Gerador mínimo de PDF (uma página A4, texto + tabela), sem dependências.
 *
 * AGORA: usado na demonstração para o botão «Baixar boletim em PDF» e para os recibos funcionarem
 * de verdade no navegador, com dados fictícios.
 * DEPOIS (Supabase): o PDF deve ser gerado e entregue pelo servidor (função segura que recusa quem
 * tem propinas em dívida). Este ficheiro deixa de ser usado para documentos oficiais.
 */
import type { BoletimTrimestre, PagamentoConfirmado, PerfilAluno } from "./types";
import { formatarKz, formatarMedia, formatarData } from "./format";

const LARGURA = 595;
const ALTURA = 842;
const MARGEM = 50;

interface Coluna {
  titulo: string;
  largura: number;
  alinhar?: "esq" | "dir";
}

export interface DocumentoPdf {
  titulo: string;
  subtitulo?: string;
  campos?: Array<[string, string]>;
  tabela?: { colunas: Coluna[]; linhas: string[][]; rodape?: string[] };
  nota?: string;
}

/** Só carateres Latin-1 (cobre o português). O resto é trocado por um equivalente simples. */
function limpar(texto: string): string {
  return texto
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\u0000-\u00FF]/g, "?");
}

const escapar = (texto: string) =>
  limpar(texto).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

/** Largura aproximada em Helvetica (suficiente para alinhar números à direita). */
function larguraTexto(texto: string, tamanho: number, negrito = false): number {
  let unidades = 0;
  for (const c of limpar(texto)) {
    if (/\d/.test(c)) unidades += 0.556;
    else if (c === "," || c === "." || c === " " || c === "\u00A0" || c === ":") unidades += 0.278;
    else if (c === "i" || c === "l" || c === "I") unidades += 0.24;
    else if (/[A-Z]/.test(c)) unidades += 0.68;
    else unidades += negrito ? 0.58 : 0.53;
  }
  return unidades * tamanho;
}

class Pagina {
  private ops: string[] = [];

  cor(r: number, g: number, b: number, tipo: "fill" | "stroke" = "fill") {
    this.ops.push(`${r} ${g} ${b} ${tipo === "fill" ? "rg" : "RG"}`);
  }

  retangulo(x: number, yTopo: number, largura: number, altura: number) {
    this.ops.push(`${x} ${ALTURA - yTopo - altura} ${largura} ${altura} re f`);
  }

  linha(x1: number, yTopo: number, x2: number) {
    const y = ALTURA - yTopo;
    this.ops.push(`0.5 w ${x1} ${y} m ${x2} ${y} l S`);
  }

  texto(conteudo: string, x: number, yTopo: number, tamanho: number, negrito = false) {
    this.ops.push(
      `BT /${negrito ? "F2" : "F1"} ${tamanho} Tf ${x.toFixed(2)} ${(ALTURA - yTopo).toFixed(2)} Td (${escapar(conteudo)}) Tj ET`,
    );
  }

  fluxo(): string {
    return this.ops.join("\n");
  }
}

export function criarPdf(doc: DocumentoPdf): Uint8Array {
  const p = new Pagina();

  // Faixa azul com o título
  p.cor(0.086, 0.196, 0.4);
  p.retangulo(0, 0, LARGURA, 92);
  p.cor(1, 1, 1);
  p.texto("Portal Escolar", MARGEM, 38, 11);
  p.texto(doc.titulo, MARGEM, 68, 22, true);

  let y = 128;
  p.cor(0.1, 0.13, 0.2);
  if (doc.subtitulo) {
    p.texto(doc.subtitulo, MARGEM, y, 13, true);
    y += 30;
  }

  for (const [rotulo, valor] of doc.campos ?? []) {
    p.cor(0.4, 0.45, 0.55);
    p.texto(rotulo, MARGEM, y, 10);
    p.cor(0.1, 0.13, 0.2);
    p.texto(valor, MARGEM + 130, y, 11, true);
    y += 20;
  }

  if (doc.tabela) {
    y += 14;
    const { colunas, linhas, rodape } = doc.tabela;
    const larguraTabela = colunas.reduce((s, c) => s + c.largura, 0);

    p.cor(0.91, 0.94, 0.98);
    p.retangulo(MARGEM, y - 14, larguraTabela, 24);

    const desenharLinha = (celulas: string[], yLinha: number, negrito: boolean, tamanho: number) => {
      let x = MARGEM;
      colunas.forEach((coluna, i) => {
        const celula = celulas[i] ?? "";
        const xTexto =
          coluna.alinhar === "dir"
            ? x + coluna.largura - 8 - larguraTexto(celula, tamanho, negrito)
            : x + 8;
        p.texto(celula, xTexto, yLinha, tamanho, negrito);
        x += coluna.largura;
      });
    };

    p.cor(0.086, 0.196, 0.4);
    desenharLinha(
      colunas.map((c) => c.titulo),
      y + 2,
      true,
      9.5,
    );
    y += 26;

    for (const celulas of linhas) {
      p.cor(0.1, 0.13, 0.2);
      desenharLinha(celulas, y, false, 10.5);
      p.cor(0.85, 0.88, 0.93, "stroke");
      p.linha(MARGEM, y + 8, MARGEM + larguraTabela);
      y += 24;
    }

    if (rodape) {
      p.cor(0.086, 0.196, 0.4);
      desenharLinha(rodape, y + 6, true, 11);
      y += 30;
    }
  }

  if (doc.nota) {
    p.cor(0.4, 0.45, 0.55);
    p.texto(doc.nota, MARGEM, ALTURA - 48, 8.5);
  }

  // ---- Estrutura do ficheiro PDF (tudo em Latin-1: 1 carácter = 1 byte) ----
  const fluxo = p.fluxo();
  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${LARGURA} ${ALTURA}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${fluxo.length} >>\nstream\n${fluxo}\nendstream`,
  ];

  let saida = "%PDF-1.4\n";
  const posicoes: number[] = [];
  objetos.forEach((corpo, i) => {
    posicoes.push(saida.length);
    saida += `${i + 1} 0 obj\n${corpo}\nendobj\n`;
  });

  const inicioXref = saida.length;
  saida += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  for (const pos of posicoes) saida += `${String(pos).padStart(10, "0")} 00000 n \n`;
  saida += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;

  const bytes = new Uint8Array(saida.length);
  for (let i = 0; i < saida.length; i++) bytes[i] = saida.charCodeAt(i) & 0xff;
  return bytes;
}

/** Descarrega o PDF no dispositivo (só no navegador). */
export function descarregarPdf(nomeFicheiro: string, bytes: Uint8Array): void {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeFicheiro;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const NOTA_DEMO = "Documento de demonstração, gerado com dados fictícios. Não tem valor oficial.";

export function gerarBoletimPdf(perfil: PerfilAluno, boletim: BoletimTrimestre): Uint8Array {
  return criarPdf({
    titulo: "Boletim de notas",
    subtitulo: `${boletim.trimestre}.º trimestre, ano letivo ${perfil.anoLetivo}`,
    campos: [
      ["Nome", perfil.nomeCompleto],
      ["Número de aluno", perfil.numeroAluno],
      ["Classe", perfil.classe],
      ["Curso", perfil.curso],
      ["Turma e turno", `${perfil.turma}, ${perfil.turno}`],
    ],
    tabela: {
      colunas: [
        { titulo: "Disciplina", largura: 175 },
        { titulo: "Aval. contínua", largura: 85, alinhar: "dir" },
        { titulo: "Prova prof.", largura: 80, alinhar: "dir" },
        { titulo: "Prova trim.", largura: 80, alinhar: "dir" },
        { titulo: "Média", largura: 75, alinhar: "dir" },
      ],
      linhas: boletim.notas.map((n) => [
        n.disciplina,
        String(n.avaliacaoContinua),
        String(n.provaProfessor),
        String(n.provaTrimestral),
        String(n.mediaTrimestral),
      ]),
      rodape: ["Média do trimestre", "", "", "", boletim.media === null ? "-" : formatarMedia(boletim.media)],
    },
    nota: NOTA_DEMO,
  });
}

export function gerarReciboPdf(perfil: PerfilAluno, pagamento: PagamentoConfirmado): Uint8Array {
  return criarPdf({
    titulo: "Recibo de pagamento",
    subtitulo: pagamento.recibo ? `Recibo n.º ${pagamento.recibo.numero}` : "Recibo",
    campos: [
      ["Aluno", perfil.nomeCompleto],
      ["Número de aluno", perfil.numeroAluno],
      ["Período pago", pagamento.periodo],
      ["Valor", formatarKz(pagamento.valor)],
      ["Confirmado em", formatarData(pagamento.confirmadoEm)],
    ],
    nota: NOTA_DEMO,
  });
}
