# Árvore de rotas — Estratégia Internacional

Mapa completo das telas. Complementa o `PRD.md` (referência de navegação e estrutura de URLs). Um só projeto Next.js: LP pública na raiz (`/`, SSG, tema claro), plataforma autenticada em `/app/*` (tema dark), páginas públicas de conversão e verificação, e admin em `/admin`.

Convenção de parâmetros: dois-pontos (`/verificar/:codigo`).

## LP e conversão (público, sem sessão)

Tema claro. Pensadas para tráfego e compartilhamento. Todo CTA de compra aponta para o checkout externo (Guru).

| Rota | Descrição |
|---|---|
| `/` | LP de vendas (SSG). Seções ancoradas: `#hero` (com kicker de marcas, headline, VSL configurável, CTA de compra), `#ficha`, `#diagnostico`, `#docentes`, `#formacao`, `#diferenca`, `#quem-assina`, `#oferta`, `#faq`, `#cta-final`. Topbar fixa com âncoras + "Entrar" (→ `/app/login`) + "Inscreva-se" (→ checkout). CTAs de compra disparam InitiateCheckout e vão para a URL do Guru. WhatsApp flutuante e VSL controlados por `showWhatsapp` / `showVsl` |
| checkout (externo) | Digital Manager Guru + Pagar.me. Fora do nosso domínio. Coleta nome, e-mail, CPF, WhatsApp, pagamento. Não é rota nossa; listada para amarrar o fluxo |
| `/obrigado` | Página de obrigado pós-compra. Confirmação "cheque seu e-mail", prazos de boleto/PIX, atalho de WhatsApp, reenvio de acesso. Dispara evento Purchase. Acessada pelo redirect do checkout |
| `/verificar/:codigo` | Verificação pública do certificado. Código válido: confirma validade e nome do titular. Código inexistente: "certificado não encontrado", sem vazar dados. Pensada para compartilhamento (LinkedIn) |
| `/termos` | Termos de uso |
| `/privacidade` | Política de privacidade e LGPD |

## Área do aluno, pré-sessão (`/app`, sem autenticação)

Tema dark. Portas de entrada da plataforma. Sem navegação principal. A conta nasce da compra (não há cadastro aberto).

| Rota | Descrição |
|---|---|
| `/app/login` | Reentrada: e-mail + senha, "Esqueci minha senha", atalho de WhatsApp. Credencial incorreta: mensagem clara com atalho de redefinição. Sem sessão e conta com pagamento pendente: estado "seu pagamento está em processamento" (boleto/PIX até 1 dia útil), nunca erro genérico. Login válido → `/app` |
| `/app/recuperar-senha` | Solicita e-mail e dispara o link de redefinição (Supabase). Confirma o envio sempre com a mesma mensagem, sem revelar se o e-mail tem conta, inclusive quando o Supabase barra por rate limit. Recebe também os avisos de link inválido (`?estado=invalido`) e expirado (`?estado=expirado`) |
| `/app/redefinir-senha` | Define a senha nova. **Sem token na URL** (ver a nota abaixo): depende da sessão que o `/auth/confirm` criou. Sem sessão, redireciona para `/app/recuperar-senha?estado=expirado`. Sucesso → `/app`, já logado |

> **Nota de implementação (28/jul/2026): o token não passa por essas telas.** A especificação
> original previa `/app/primeiro-acesso/:token` e `/app/redefinir-senha/:token`, com o token
> no caminho. Não é como o Supabase entrega, e não é o que a gente quer.
>
> O e-mail carrega um `token_hash` e aponta para **`/auth/confirm`**, um route handler que
> chama `verifyOtp` e troca o hash por sessão em cookie; só então o aluno chega ao formulário
> de senha. Duas razões. A primeira é técnica: o `@supabase/ssr` fixa `flowType: "pkce"`, e o
> PKCE guarda um `code_verifier` no cookie do dispositivo que **pediu** o reset, então quem
> pede no celular e abre o e-mail no desktop não consegue concluir. A segunda é de segurança:
> o token morre no handler e nunca aparece na URL da tela onde a senha é digitada, logo não
> fica no histórico nem escapa por `Referer`.
>
> Consequência a saber: depois do `verifyOtp` o aluno tem **sessão completa**, não só
> permissão de trocar senha. É como o Supabase funciona, e o `updateUser` depende disso. Quem
> tem o link entra na área. O contrapeso é o TTL do link, 1 hora por padrão, configurável no
> painel.

### `/auth/confirm` (fora de `/app`, sem tema)

| Rota | Descrição |
|---|---|
| `/auth/confirm` | Route handler `GET`. Recebe `token_hash` e `type`, chama `verifyOtp` e grava a sessão em cookie. Aceita `type=recovery` (esqueci a senha) e `type=invite` (primeiro acesso, o link que o webhook do Guru gera). `next` opcional define o destino, restrito a caminho interno para não virar redirect aberto. Falha de hash, link expirado ou já usado caem todos em `/app/recuperar-senha?estado=expirado`, com a mesma mensagem, para não virar oráculo de token válido |

**Primeiro acesso** deixou de ter rota própria: é o mesmo handler com `type=invite`, que termina
no `/app/redefinir-senha`. Enquanto o Guru não entra, o homolog segue usando o atalho
`/app/login?s=primeiro`, que cria a conta com service role.

## Área do aluno, pós-sessão (`/app/*`, autenticado)

Tema dark. Header com olho + wordmark, navegação (Início, Dúvidas via WhatsApp, FAQ), avatar/inicial e menu "Minha conta ▾" (Minha conta, Sair).

**Guarda de acesso (implementada em 29/jul, no layout do grupo `(sala)`).** Vale para todas as
rotas desta seção de uma vez: matrícula que não esteja `ativa` redireciona para `/app/acesso`,
preservando o progresso. São **três** estados de bloqueio, e não dois: `expirada`, `revogada` e
`ausente` (conta logada sem matrícula nenhuma, que pelo `PRD.md` §4 é anomalia de
provisionamento, não prazo vencido).

> **Mudança de comportamento em relação ao que esta tabela dizia (29/jul).** A linha de
> `/app/conta` previa que ela **abrisse** com acesso expirado, bloqueando só o conteúdo do
> curso. A guarda no layout bloqueia o grupo inteiro, inclusive a conta. Ficou assim porque a
> própria `/app/acesso` já entrega o que a pessoa bloqueada precisa (o motivo, o suporte e a
> troca de conta), e abrir exceção por tela transformaria uma regra de uma linha em uma lista de
> exceções para manter. **Se a conta precisar mesmo abrir bloqueada, é uma decisão de produto e
> o lugar do conserto é este parágrafo.**

> **O certificado é a exceção, e tem grupo próprio (29/jul, pedido do Pedro).** Ele saiu do
> `(sala)` para o grupo `(certificado)`, com guarda própria, porque **o diploma é do aluno e não
> do prazo dele**: quem concluiu continua baixando depois de o acesso terminar. A URL não muda.
> Duas travas continuam valendo: **matrícula revogada** bloqueia (reembolso ou chargeback desfez
> a compra, e manter o certificado seria entregar o produto de graça), e **sem certificado
> emitido e sem todas as aulas que contam concluídas ninguém entra**, com acesso válido ou não.
> Até 30/set/2026 a segunda trava era a aprovação na prova final; ver a nota abaixo.

> **O curso não tem prova final nem e-book (decisão do dono, 30/set/2026).** As rotas
> `/app/prova`, `/app/prova/questao/:q` e `/app/prova/resultado` foram apagadas; qualquer endereço
> sob `/app/prova` redireciona (307) para `/app`, pelo `redirects()` do `next.config.ts`. O
> **certificado passou a sair na conclusão**: quando o aluno marca a última aula que conta
> (`lessons.conta_no_gate`, em todos os módulos), a action `marcarAula` emite o certificado (mesmo
> gerador de código, idempotente pelo índice único de `certificates(user_id)`) e manda o e-mail
> `certificado` (migration `0026`). Concluir um módulo pelo admin tem o mesmo efeito. Certificado
> já emitido pela prova continua valendo, com o mesmo código.

| Rota | Descrição |
|---|---|
| `/app` | Home em vitrine. Banner hero: vídeo de boas-vindas; com progresso, overlay "Continue de onde parou → Módulo X · Aula Y" (Y é a posição da aula no módulo) e CTA de retomada apontando para a primeira aula não concluída, no teatro da página do módulo dela. Prateleira "A Formação" (Módulo I a IV desde 05/out/2026, cada card com arte, contador X/N e estado; o clique leva a `/app/modulo/:m`). Card do certificado: "sai ao concluir as N aulas · faltam X" ou "emitido", que leva a `/app/certificado`. Sem e-book e sem card de prova desde 30/set/2026 |
| `/app/comece` | Redirect para `/app/modulo/0` desde 05/out/2026, quando o Módulo 0 de boas-vindas saiu do curso. De 29/set a 05/out era o "Comece por aqui", a porta de boas-vindas. A rota fica para links antigos; criar ou redefinir a senha leva direto a `/app/modulo/0` |
| `/app/modulo/:m?aula=:n#aula-:n` | **A página do módulo é a sala de aula (30/set/2026)**, para todos os módulos; o ord 0 é o Módulo I desde 05/out/2026 (`rotuloModulo` em `lib/curso.ts`). De cima para baixo: (1) **teatro**: palco escuro, player 16:9 da aula escolhida, título, "Marcar como concluída" (`AulaClient` + action `marcarAula`, mesmo contrato `data-concluir`), bio curta do docente, anterior/próxima, materiais da aula (tipo `ebook` filtrado) e, quando a última aula do módulo está concluída, um cartão de fim de módulo com o próximo módulo ou a data em que ele abre; (2) **playlist**: as aulas do módulo em fila horizontal ("Aula 1", "Aula 2"..., título, duração quando houver, concluída, atual em destaque), cada cartão um link para `?aula=:n#aula-:n`; (3) **notebook**: um documento só para o módulo, uma seção por aula com `id="aula-:n"`, índice lateral fixo. `:n` é a **posição da aula no módulo** (1, 2, 3...), não o número global. Sem `?aula=` ou com valor inválido, toca a primeira aula não concluída (todas concluídas: a primeira). A seleção é do servidor: funciona sem JS e o endereço é compartilhável; com JS, `AncoraDaAula` mantém o vídeo à vista e rola a caixa do notebook até a seção. **Módulo fechado mostra a página sem teatro**: cabeça com a data ou o motivo da abertura, aviso, títulos das aulas sem link, trilha; nada de vídeo, material ou notebook. A guarda é `getCalendario()` (regra de `lib/liberacao.ts`), a mesma da action |
| `/app/modulo/:m/aula/:n` | **Redirect** (30/set/2026) para `/app/modulo/:m?aula=:pos#aula-:pos`. Aqui `:n` é o número GLOBAL da aula (0 a 16, o dos links antigos e e-mails); a rota converte para a posição no módulo real da aula. Aula inexistente: 404 |
| `/app/modulo/:m/notebook` | **Redirect** (30/set/2026) para `/app/modulo/:m#notebook`. O notebook deixou de ter página própria |
| `/app/prova/*` | **Removida** (30/set/2026). Redirect 307 para `/app` no `next.config.ts` |
| `/app/certificado` | Certificado. Preview (wordmark, olho, gravuras, nome, 30h, assinaturas), "Baixar PDF", "Compartilhar no LinkedIn", bloco de NPS (0 a 10). Entra quem já tem certificado ou concluiu todas as aulas que contam; senão redireciona para `/app` (ou `/app/acesso`, sem acesso ativo). O texto diz que o aluno "concluiu todas as aulas". Sem código no banco (conclusão anterior à emissão automática), a tela emite no resgate e manda o e-mail. Código `EI-XXXX-XXXX` exibido, com link para `/verificar/:codigo`. Reemissão reusa o mesmo código |
| `/app/conta` | Minha conta. Dados (nome, e-mail com "alterar via suporte", trocar senha self-service), Acesso ("liberado por 1 ano", disponível até `accessUntil`), Suporte (atalho WhatsApp). Acesso expirado: abre, mas o conteúdo do curso fica bloqueado com via de renovação |
| `/app/acesso` | Tela de renovação e bloqueio. **Fora do grupo `(sala)`** (lá dentro, a guarda se redirecionaria para si mesma em laço) e **sem chrome**, porque a navegação do chrome leva ao curso, que é o que está bloqueado. Destino da guarda nos estados `expirada`, `revogada` e `ausente`, cada um com texto próprio; o estado vem **do banco, nunca da URL**. Oferece o suporte e "trocar de conta" (que faz `signOut` antes, senão a sessão antiga empurra de volta para cá em laço). Progresso preservado, e a tela diz isso. Quem tem acesso ativo é devolvido para `/app` |

## Admin (`/admin`, papel admin)

Acesso role-based. Fora da navegação do aluno, com layout e URL próprios. Construído a partir de
30/jul/2026; planta e decisões em `PLANO-ADMIN.md`.

**Porta de entrada é a mesma `/app/login`**, e o redirect pós-login decide pelo papel. Não existe
`/admin/login`: dobraria a superfície de autenticação e pediria o próprio fluxo de recuperação.

**Quem chega sem ser admin** (guarda no `app/admin/layout.tsx`, não no proxy):

| Quem | Resposta | Por quê |
|---|---|---|
| Sem sessão | 307 para `/app/login` | Não revelou nada sobre si, e 404 deixaria o admin legítimo de fora sem entender que só faltava entrar |
| Logado, não admin | **404** | Redirecionar para `/app` confirmaria que a rota existe para quem digitou o endereço |

**Dois níveis de admin** (migration `0005`): mestre e comum. O comum faz tudo menos mexer no acesso
de um mestre.

| Rota | Estado | Descrição |
|---|---|---|
| `/admin` | **no ar** | Painel. Quatro cards de número real: matrículas (e quantas ativas), conclusão de aulas, formação concluída, certificados. Funil do acesso ao certificado, sem etapas de prova desde 30/set/2026 |
| `/admin/alunos` | **no ar** | Lista de todas as contas: nome, e-mail, acesso, progresso X/N, certificado (código ou "não emitido"). Busca por nome ou e-mail e filtro por status, os dois na URL via `<form method="get">` |
| `/admin/alunos/:id` | **no ar** | Cadastro, datas, liberação, progresso por módulo (com a coluna "conta no gate" e concluir/limpar por módulo) e o certificado (código com link para a verificação, ou quantas aulas faltam). Concluir o último módulo pendente emite o certificado. A liberação de 2ª chamada saiu com a prova |
| `/admin/equipe` | **no ar** | Quem tem acesso ao painel. Busca por e-mail, dar e remover acesso de admin. Escopo novo de 30/jul, não previsto na planta original |
| `/admin/questoes` | **removida** | Saiu com a prova (30/set/2026), junto com `/admin/api/questoes` e `/admin/api/prova`. Redirect 307 para `/admin` |
| `/admin/conteudo` | a fazer | Módulos, aulas e materiais (`PLANO-ADMIN.md` §4.6). Depende de três decisões do Pedro |
| `/admin/emails` | a fazer | Leitura do `email_log` (aluno, template, envio, status) |

**Uma rota que não é tela:** `POST /admin/api/papel` concede e revoga `is_admin`. Route handler
**não passa por layout**, então a guarda acima não a protege: ela refaz a checagem de papel por
conta própria, e sem isso qualquer pessoa logada mudaria privilégio por POST direto. Vale para toda
rota nova sob `app/admin/`, e para Server Action. Ver `HANDOFF.md` §6.

Na sidebar, tela que ainda não existe aparece **sem link** e marcada "em breve", em vez de virar um
404 depois do clique.

## Estados de rota do grupo `(sala)` (29/jul/2026)

Três arquivos de convenção do App Router, mais um catch-all, valendo para **todas** as telas
autenticadas de uma vez. Antes não existiam em lugar nenhum do projeto.

| Arquivo | Quando aparece |
|---|---|
| `(sala)/loading.tsx` | Transição entre telas. Toda rota de `/app/*` lê o usuário no servidor antes de responder, então em conexão lenta o clique ficava sem resposta |
| `(sala)/error.tsx` | Exceção de servidor na área. Oferece recarregar, aponta o suporte e mostra o `digest`, que é o identificador do log |
| `(sala)/not-found.tsx` | 404 dentro do chrome da área. Atende quem chama `notFound()` no ramo, como a aula inexistente |
| `(sala)/[...resto]/page.tsx` | Catch-all que chama `notFound()`. Existe porque `not-found.tsx` aninhado **não** atende URL sem rota nenhuma: ela cairia no 404 global, que é do layout raiz e vem no tema claro da LP. Rota explícita sempre vence catch-all |

Nota de medição: as duas rotas de 404 respondem **200**, e não 404, porque o streaming já enviou
o começo da resposta antes do `notFound()`. Medido antes e depois desta leva, então não é
regressão. Não vale perseguir: a área é autenticada e não há indexação.

## Estados que não viram rota própria

Renderizados como variação da mesma tela (não têm URL distinta), listados para o design cobrir:

- **Login**: normal, primeiro acesso, erro de credencial, pagamento pendente (variações de `/app/login` e `/app/primeiro-acesso/:token`), e **sessão expirada** (`?estado=expirou`, mandado pelo proxy só para quem tinha sessão de fato).
- **Card de módulo**: concluído (✓), em andamento, não iniciado (variações do card em `/app`).
- **Certificado, card na home**: pendente (com quantas aulas faltam), aulas concluídas sem código ainda, emitido (variações do card em `/app`).
- **Página do módulo**: aberto com teatro, fechado (sem teatro), aberto sem aulas publicadas; fim de módulo (cartão no palco).

## Deep links de e-mail

Cada e-mail transacional (PRD seção 14) aponta para uma rota:

| E-mail | Destino |
|---|---|
| Boas-vindas + acesso (3) | `/auth/confirm?token_hash={{ .TokenHash }}&type=invite` → `/app/redefinir-senha` |
| Reset de senha (4) | `/auth/confirm?token_hash={{ .TokenHash }}&type=recovery` → `/app/redefinir-senha` |
| D+3 sem login (5) / D+14 inativo (7) | `/app` |
| Módulo concluído (6) | `/app` (ou `/app/modulo/:m` do próximo módulo) |
| Certificado emitido (template `certificado`, migration 0026) | `/app/certificado` |
| Pedido recebido (1) / cartão recusado (2) / carrinho abandonado (12 a 14) | checkout Guru (externo) |
| Reembolso confirmado (11) | sem destino de app (informacional) |

---
*Derivado do PRD.md em 17/jul/2026. Próximo documento: DESIGN.md.*
