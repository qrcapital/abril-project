import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança.
 *
 * Moram aqui E no `netlify.toml`. O bloco `[[headers]]` do toml só vale para o que a CDN da
 * Netlify serve direto (imagens, fontes); as páginas saem da função do Next e passavam sem
 * nenhum deles, conferido no ar em 29/set/2026. O `headers()` do Next vale para as duas.
 *
 * A CSP é só `frame-ancestors` DE PROPÓSITO: uma CSP de `script-src` quebraria o RD Station, o
 * player do Panda e os scripts inline das páginas portadas. O que ela precisa impedir aqui é a
 * tela de senha e o admin dentro de um iframe alheio (clickjacking), e isso ela impede.
 */
const SEGURANCA = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

/**
 * Endereços que deixaram de existir e ainda circulam (favorito, e-mail antigo, histórico).
 *
 * A prova final saiu do curso em 30/set/2026 (decisão do dono), e com ela as telas do aluno e a de
 * Questões do admin. Quem chega por um link antigo vai para o início da área dele, em vez de um 404
 * que pareceria defeito. Temporário (307) e não permanente de propósito: um 308 fica gravado no
 * navegador, e o dia em que alguma coisa voltar a morar nesses endereços ninguém consegue desfazer.
 *
 * Os redirects da aula e do notebook antigos NÃO estão aqui: eles precisam do currículo para
 * converter o número da aula, e moram nas próprias rotas (`app/app/(sala)/modulo/[m]/...`).
 */
const ENDERECOS_ANTIGOS = [
  { source: "/app/prova/:resto*", destination: "/app", permanent: false },
  { source: "/admin/questoes/:resto*", destination: "/admin", permanent: false },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SEGURANCA }];
  },
  async redirects() {
    return ENDERECOS_ANTIGOS;
  },
};

export default nextConfig;
