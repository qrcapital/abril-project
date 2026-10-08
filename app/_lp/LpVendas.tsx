/**
 * A página do curso, extraída de `app/page.tsx` em 13/out/2026.
 *
 * Ela saiu da raiz porque o domínio ficou público antes de as vendas abrirem, e quem digitasse o
 * endereço caía numa tela com preço e botão de compra de um curso fechado. Virou componente, e não
 * uma segunda cópia, para as duas rotas que a servem (`/curso` hoje, `/` depois da abertura)
 * mostrarem sempre a mesma página. Quem decide qual rota atende é `app/_lp/fase.ts`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HeroPointer from "./HeroPointer";
import GloboCanvas from "./GloboCanvas";
import CarrosselDots from "./CarrosselDots";
import VslMount from "./VslMount";
import GraficoEntrada from "./GraficoEntrada";
import DolarVivo from "./DolarVivo";
import BarraCompra from "./BarraCompra";

// Design real da LP: markup e CSS em app/_lp, assets em /public/lp. Renderizado
// como página estática. Nasceu de um bundle do Claude Design portado por
// scripts/port-lp.mjs; o script foi aposentado em 22/set/2026 e body.html e
// styles.css passaram a ser a fonte. Editar os dois direto (ver AGENTS.md).
// A leitura fica DENTRO do componente (roda no build p/ o SSG; em dev, a cada
// request) para que edições no body.html/styles.css apareçam sem reiniciar o
// dev server — o readFileSync em escopo de módulo era cacheado pelo Next.
/**
 * O destino do "GARANTIR MINHA VAGA": o checkout do Guru, de `NEXT_PUBLIC_CHECKOUT_URL`.
 *
 * O botão apontava para `/app/login?s=primeiro`, o cadastro livre de homolog, que em produção é
 * fechado (`cadastroAberto`). Ou seja: com as vendas abertas, o botão principal da página levaria
 * a uma tela que recusa o cadastro. O `body.html` agora traz o marcador `{{CHECKOUT_URL}}`, e a
 * troca acontece aqui, no build.
 *
 * Só `https://` passa. A variável é colada à mão no painel da Netlify, e um `javascript:` ou um
 * endereço sem protocolo viraria um botão que executa código ou leva a lugar nenhum. Sem ela, o
 * botão aponta para a própria seção da oferta: não vende, mas também não quebra.
 */
function destinoDoCheckout(): string {
  const url = (process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "").trim();
  if (!/^https:\/\/[^\s"'<>]+$/i.test(url)) return "#oferta";
  return url.replace(/&/g, "&amp;");
}

export default function LpVendas() {
  const dir = join(process.cwd(), "app", "_lp");
  // Sistema primeiro, estilo da LP depois: ele declara tokens e primitivas, e o
  // styles.css especializa por cima. Ver app/_design/sistema.css.
  const sistema = readFileSync(join(process.cwd(), "app", "_design", "sistema.css"), "utf8");
  const lpCss = readFileSync(join(dir, "styles.css"), "utf8");
  const lpBody = readFileSync(join(dir, "body.html"), "utf8").replaceAll(
    "{{CHECKOUT_URL}}",
    destinoDoCheckout(),
  );
  return (
    <>
      {/* Marca .tem-js no <html> ANTES da primeira pintura. Todo estado
          inicial fechado de animacao (ver `.tem-js .graf` no styles.css)
          pende desta classe, entao sem JS o conteudo aparece inteiro em vez
          de ficar invisivel esperando um observer que talvez nunca rode.
          Precisa ser inline e sincrono: um efeito de React roda depois da
          pintura e causaria flash. E precisa vir de page.tsx, porque script
          dentro de dangerouslySetInnerHTML nao executa. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('tem-js')" }} />
      <style dangerouslySetInnerHTML={{ __html: sistema + "\n" + lpCss }} />
      {/* lining-nums: o Playfair vinha com algarismos oldstyle (3,4,5,7,9 descem
          abaixo da baseline; só 0/1/2 alinham). Força figuras lining para os
          números ficarem todos na mesma linha. Herda p/ toda a LP (não há
          shorthand `font:` que resete a propriedade). */}
      <div style={{ fontVariantNumeric: "lining-nums" }} dangerouslySetInnerHTML={{ __html: lpBody }} />
      <HeroPointer />
      <GloboCanvas />
      <CarrosselDots />
      <VslMount />
      <GraficoEntrada />
      <DolarVivo />
      <BarraCompra />
    </>
  );
}
