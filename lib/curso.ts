// Modelo de dados do curso (fonte única do currículo para a área do aluno).
// Hoje é estático — quando o Supabase entrar, estas funções passam a ler do banco
// mantendo a mesma forma, sem mexer na UI. `n` é o número da aula na URL
// (0 = boas-vindas; 1..16 = aulas dos módulos I–IV). `modulo` é o índice (0..4).

export type Modulo = {
  idx: number;
  label: string; // "Módulo 0", "Módulo I", ...
  titulo: string;
  docente?: string;
};

export type Aula = {
  n: number; // número na URL (0..16)
  modulo: number; // índice do módulo (0..4)
  numero: string; // rótulo exibido ("" para boas-vindas, "01".."16")
  titulo: string;
  descricao: string;
};

// Os títulos acompanham o PRD §2 e a LP. O do módulo IV encurta "Ativos Digitais:
// Exposição Alternativa em Dólar" para caber no card da vitrine, no mesmo registro
// dos outros ("<tema> em Dólar", "<tema> nos EUA").
export const MODULOS: Modulo[] = [
  { idx: 0, label: "Módulo 0", titulo: "Bem-vindo" },
  { idx: 1, label: "Módulo I", titulo: "Macro e Estratégia Global", docente: "Rodolfo Bastos" },
  { idx: 2, label: "Módulo II", titulo: "Renda Fixa e Ações nos EUA", docente: "Tony Volpon" },
  { idx: 3, label: "Módulo III", titulo: "Como Acessar o Mercado Americano", docente: "Luiz Fernando Roxo" },
  { idx: 4, label: "Módulo IV", titulo: "Ativos Digitais em Dólar", docente: "Alexandre Ywata" },
];

export const AULAS: Aula[] = [
  { n: 0, modulo: 0, numero: "", titulo: "Como aproveitar a formação", descricao: "Boas-vindas à formação e um guia rápido de como tirar o máximo dos módulos, dos materiais e da certificação." },

  { n: 1, modulo: 1, numero: "01", titulo: "Por que a dolarização de ativos?", descricao: "O racional de proteger o patrimônio movendo parte da carteira para o dólar, e o que muda no longo prazo." },
  { n: 2, modulo: 1, numero: "02", titulo: "O dólar como reserva de valor", descricao: "O papel da moeda americana na preservação de patrimônio e por que ela ancora a estratégia internacional." },
  { n: 3, modulo: 1, numero: "03", titulo: "Conta internacional na prática", descricao: "Como abrir, movimentar e operar uma conta fora do Brasil, do cadastro à primeira remessa." },
  { n: 4, modulo: 1, numero: "04", titulo: "Carteira global e perfil de investidor", descricao: "Montando a alocação internacional de acordo com o seu perfil de risco e seus objetivos." },

  { n: 5, modulo: 2, numero: "05", titulo: "Tesouro americano", descricao: "Como funciona a renda fixa mais segura do mundo e os caminhos para acessá-la do Brasil." },
  { n: 6, modulo: 2, numero: "06", titulo: "Crédito privado internacional", descricao: "Bonds corporativos e as oportunidades de renda em dólar além dos títulos do governo." },
  { n: 7, modulo: 2, numero: "07", titulo: "Comprando ações nos EUA", descricao: "Como encontrar, analisar e selecionar stocks: análise fundamentalista e técnica aplicadas ao mercado americano, do primeiro filtro à decisão de alocação." },
  { n: 8, modulo: 2, numero: "08", titulo: "Dividendos vs. growth investing", descricao: "Duas filosofias de investimento em ações e como decidir qual faz sentido para a sua carteira." },

  { n: 9, modulo: 3, numero: "09", titulo: "ETFs", descricao: "Investindo em cestas diversificadas de ativos com um único papel, de forma simples e barata." },
  { n: 10, modulo: 3, numero: "10", titulo: "REITs", descricao: "Como investir no mercado imobiliário americano e receber aluguéis em dólar." },
  { n: 11, modulo: 3, numero: "11", titulo: "BDRs", descricao: "Acessando ações e ETFs internacionais direto pela bolsa brasileira." },
  { n: 12, modulo: 3, numero: "12", titulo: "Tributação e sucessão internacional", descricao: "Impostos, declaração e planejamento sucessório dos ativos mantidos no exterior." },

  { n: 13, modulo: 4, numero: "13", titulo: "Bitcoin e Ethereum", descricao: "Os fundamentos dos dois principais criptoativos e o papel de cada um numa carteira dolarizada." },
  { n: 14, modulo: 4, numero: "14", titulo: "Tokens, RWA e o ecossistema", descricao: "Além do Bitcoin: tokens, ativos do mundo real (RWA) e como ler o ecossistema cripto." },
  { n: 15, modulo: 4, numero: "15", titulo: "ETFs e análise on-chain", descricao: "Exposição por ETF regulado, seja de ativos digitais ou de um setor específico da economia global, com métricas on-chain para ler o que o preço não mostra." },
  { n: 16, modulo: 4, numero: "16", titulo: "Tributação de criptoativos", descricao: "Como declarar e pagar impostos sobre ganhos com criptoativos no Brasil." },
];

// Total de aulas contadas no progresso (módulos I–IV; boas-vindas fica à parte).
export const TOTAL_AULAS = 16;

export function moduloDe(idx: number): Modulo {
  return MODULOS[idx] ?? MODULOS[0];
}

// Primeira aula de um módulo (destino do card da Home).
export function primeiraAulaDoModulo(idx: number): Aula {
  return AULAS.find((a) => a.modulo === idx) ?? AULAS[0];
}

// Aula atual = primeira ainda não concluída (destino do "Continuar").
export function aulaAtual(concluidas: Set<number>): Aula {
  return AULAS.find((a) => !concluidas.has(a.n)) ?? AULAS[AULAS.length - 1];
}

// Prova Final libera só com as 16 aulas (I–IV) concluídas.
export function provaLiberada(concluidas: Set<number>): boolean {
  return AULAS.filter((a) => a.n >= 1).every((a) => concluidas.has(a.n));
}
export function aulasRestantes(concluidas: Set<number>): number {
  return AULAS.filter((a) => a.n >= 1 && !concluidas.has(a.n)).length;
}

export function acharAula(n: number): { aula: Aula; pos: number } | null {
  const pos = AULAS.findIndex((a) => a.n === n);
  return pos < 0 ? null : { aula: AULAS[pos], pos };
}

export function href(a: Aula): string {
  return `/app/modulo/${a.modulo}/aula/${a.n}`;
}

export function vizinhas(pos: number): { anterior?: Aula; proxima?: Aula } {
  return { anterior: AULAS[pos - 1], proxima: AULAS[pos + 1] };
}

// Contagem e % de progresso — mesma base (como no design: "7 de 16").
export function concluidasContagem(concluidas: Set<number>): number {
  return concluidas.size;
}
export function progressoPct(concluidas: Set<number>): number {
  return Math.round((concluidas.size / TOTAL_AULAS) * 100);
}
