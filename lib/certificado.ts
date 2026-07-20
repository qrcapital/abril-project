// Dados do certificado + helpers de verificação e compartilhamento.
// Hoje é estático (homolog); com o Supabase, `verificar` passa a chamar a função
// `verify_certificate` do banco, mantendo a mesma forma.

export type Certificado = {
  codigo: string;
  nome: string;
  curso: string;
  horas: number;
  emissao: { ano: number; mes: number };
};

export const CERT: Certificado = {
  codigo: "EI-2026-4817",
  nome: "Pedro Teixeira",
  curso: "Estratégia Internacional",
  horas: 30,
  emissao: { ano: 2026, mes: 7 },
};

// Verifica um código (case-insensitive). Retorna o certificado ou null.
export function verificar(codigo: string): Certificado | null {
  return (codigo || "").trim().toUpperCase() === CERT.codigo ? CERT : null;
}

// URL de "adicionar certificação" ao perfil do LinkedIn.
export function linkedinAddUrl(origin: string, cert: Certificado = CERT): string {
  const p = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: cert.curso,
    organizationName: "BlockTrends",
    issueYear: String(cert.emissao.ano),
    issueMonth: String(cert.emissao.mes),
    certId: cert.codigo,
    certUrl: `${origin}/verificar/${cert.codigo}`,
  });
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
}
