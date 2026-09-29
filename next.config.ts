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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SEGURANCA }];
  },
};

export default nextConfig;
