/**
 * A casca das telas de acesso: login, primeiro acesso, recuperar e redefinir senha, aceite dos
 * termos e acesso bloqueado. O estilo mora em `app/app/_ui/auth.css`, tudo escopado em `.au`.
 *
 * ┌─ POR QUE ISTO É CÓDIGO NOSSO E NÃO MAIS HTML PORTADO ─────────────────────────────────────────┐
 * │ Até 29/set/2026 a casca era `screens/login.html`, gerado pelo `scripts/port-area.mjs` a partir │
 * │ do bundle do design, na identidade verde. Ela foi refeita na identidade da campanha, e se      │
 * │ continuasse sendo saída do porte, a próxima execução dele devolveria o verde por cima sem      │
 * │ avisar. O porte deixou de gerar as telas de login, e a casca passou a morar aqui.              │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * O contrato com os clientes é pequeno e vale a pena conhecer antes de mexer:
 *
 * - `LoginClient` acha os campos por `input`, o botão por `button`, e clona o `<label>` que vem
 *   IMEDIATAMENTE antes do campo de e-mail para criar o "Nome completo" em homolog;
 * - ele também acha os links pelo texto: "WhatsApp" e "Esqueci minha senha";
 * - os clientes das telas de senha pintam a caixa de mensagem em `[data-feedback]`.
 *
 * Mudar a ordem label/input, o texto dos links ou tirar o slot quebra essas telas em silêncio.
 */

/** Escapa texto para dentro de HTML. Os textos daqui são nossos, mas títulos e leads vêm de props. */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** O olho do hero da LP. Ver o comentário de `.au-olho` no CSS sobre por que este e não o do bundle. */
const OLHO = "/lp/f2070b29-906c-48d8-92c7-0948fe19573b.webp";

/** Monta a tela inteira em volta do miolo da coluna do formulário. */
export function casca(miolo: string): string {
  return (
    `<div class="au">` +
    `<div class="au-form">` +
    // O lockup leva para a raiz, que é a porta da frente do domínio: a pré-lista até a abertura
    // das inscrições, o curso depois. Ver `app/_lp/fase.ts`.
    `<a class="au-lock" href="/" aria-label="VEJA Negócios apresenta Estratégia Internacional">` +
    `<img class="au-lock-veja" src="/marca/veja-negocios-claro.svg" alt="VEJA Negócios">` +
    `<i class="au-lock-tr" aria-hidden="true"></i>` +
    `<span class="au-lock-curso">Estratégia<br>Internacional</span>` +
    `</a>` +
    `<div class="au-miolo">` +
    `<img class="au-olho-movel" src="${OLHO}" alt="" aria-hidden="true">` +
    miolo +
    `</div>` +
    `<nav class="au-pe" aria-label="Documentos">` +
    `<a href="/privacidade">Política de Privacidade</a><i aria-hidden="true"></i>` +
    `<a href="/termos-de-uso">Termos de Uso</a>` +
    `</nav>` +
    `</div>` +
    `<div class="au-marca">` +
    `<div class="au-globo" aria-hidden="true"><img src="/marca/globo-dourado.svg" alt=""></div>` +
    `<img class="au-olho" src="${OLHO}" alt="" aria-hidden="true">` +
    `<div class="au-powered"><span>Powered by</span>` +
    `<img src="/marca/blocktrends-branco.svg" alt="BlockTrends"></div>` +
    `</div>` +
    `</div>`
  );
}

// ---- peças do miolo ---------------------------------------------------------------------------

export const titulo = (t: string) => `<h1 class="au-h1">${esc(t)}</h1>`;
export const lead = (t: string) => `<p class="au-lead">${esc(t)}</p>`;
export const eyebrow = (t: string) => `<p class="au-eyebrow">${esc(t)}</p>`;
export const rotulo = (t: string, para?: string) =>
  `<label class="au-rotulo"${para ? ` for="${para}"` : ""}>${esc(t)}</label>`;
export const botao = (t: string, tipo: "submit" | "button" = "submit") =>
  `<button type="${tipo}" class="au-botao">${esc(t)}</button>`;
export const link = (href: string, t: string) => `<a href="${href}" class="au-link">${esc(t)}</a>`;
export const rodape = (html: string) => `<p class="au-rodape">${html}</p>`;

export function input(dados: {
  nome?: string;
  tipo: "email" | "password" | "text";
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}): string {
  return (
    `<input class="au-input" type="${dados.tipo}"` +
    (dados.nome ? ` id="${dados.nome}" name="${dados.nome}"` : "") +
    (dados.required ? " required" : "") +
    (dados.autoComplete ? ` autocomplete="${dados.autoComplete}"` : "") +
    (dados.placeholder ? ` placeholder="${esc(dados.placeholder)}"` : "") +
    `>`
  );
}

// ---- as quatro variantes do login -------------------------------------------------------------

const EMAIL =
  rotulo("E-mail", "email") +
  input({ nome: "email", tipo: "email", autoComplete: "email", placeholder: "seu@email.com" });

const AJUDA = rodape(`Precisa de ajuda? <a href="#" class="au-link">Fale no WhatsApp</a>`);

/** Senha do login normal: o rótulo divide a linha com o "Esqueci minha senha". */
const SENHA_LOGIN =
  `<div class="au-rotulo-linha">` +
  rotulo("Senha", "senha") +
  `<a href="#" class="au-link au-link-miudo">Esqueci minha senha</a>` +
  `</div>` +
  input({ nome: "senha", tipo: "password", autoComplete: "current-password" });

const CABECA_LOGIN =
  titulo("Bem-vindo de volta") + lead("Acesse com o e-mail da sua compra e continue de onde parou.");

/**
 * As variantes que a rota `/app/login?s=` serve. Três delas existem só para teste de homolog (a
 * barra "Teste" do `LoginClient`); a regular é a que o aluno vê.
 */
export const LOGIN = {
  regular: casca(CABECA_LOGIN + EMAIL + SENHA_LOGIN + botao("Entrar", "button") + AJUDA),

  erro: casca(
    CABECA_LOGIN +
      `<div class="au-caixa au-caixa-erro" role="alert"><span class="au-caixa-glifo" aria-hidden="true">!</span>` +
      `<span>E-mail ou senha incorretos. Verifique os dados e tente novamente, ou redefina sua senha abaixo.</span></div>` +
      EMAIL +
      SENHA_LOGIN +
      botao("Entrar", "button") +
      AJUDA,
  ),

  pendente: casca(
    CABECA_LOGIN +
      `<div class="au-caixa au-caixa-aviso"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle>` +
      `<path d="M12 7v5l3 2"></path></svg><span>Seu pagamento está em processamento. Assim que o banco ` +
      `confirmar (boleto e Pix levam até 1 dia útil), seu acesso é liberado e avisamos por e-mail. ` +
      `Precisa de ajuda? Fale com o suporte.</span></div>` +
      EMAIL +
      SENHA_LOGIN +
      botao("Entrar", "button") +
      AJUDA,
  ),

  primeiro: casca(
    eyebrow("Primeiro acesso") +
      titulo("Defina sua senha") +
      lead("Você chegou pelo link do e-mail de boas-vindas. Crie uma senha para entrar na sua formação.") +
      EMAIL +
      rotulo("Nova senha", "senha") +
      input({ nome: "senha", tipo: "password", autoComplete: "new-password" }) +
      rotulo("Confirmar senha", "repetir") +
      input({ nome: "repetir", tipo: "password", autoComplete: "new-password" }) +
      botao("Definir senha", "button") +
      AJUDA,
  ),
} as const;
