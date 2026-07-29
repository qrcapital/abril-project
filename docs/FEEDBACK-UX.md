# Mapa de feedback ao usuário

Auditoria tela por tela de onde o aluno precisa de resposta do sistema, o que já existe e o
que falta. Levantado em 28/jul/2026 lendo os clients, não de memória.

Motivo de existir: a área do aluno cresceu por tela, cada uma resolvendo o seu feedback à
mão, e apareceu divergência. Duas telas mostram erro com `role="alert"`, outras com uma
`div` sem papel nenhum; um botão pesado não avisa que está trabalhando; e há um botão que
não faz nada. Sem um lugar único, isso continua divergindo.

Complementa o `DESIGN.md`, que define **como** um estado se parece, e o `ROUTES.md`, que
lista os estados que não viram rota. Este documento diz **onde** falta.

## O princípio

Toda ação do aluno que não é instantânea tem quatro estados, e a tela precisa dar conta dos
quatro: **parado**, **trabalhando**, **deu certo**, **deu errado**. Formulário que cria algo
ganha um quinto, o **progresso do preenchimento**, que é o caso da senha: mostrar quais
exigências já foram atendidas enquanto a pessoa digita, em vez de só reprovar no envio.

Duas regras da casa que limitam o desenho:

- O `DESIGN.md` trava o dial de motion em **baixo**, e o único elemento pulsante do produto é
  o glow da oferta. Feedback aqui é texto, cor de borda, opacidade e troca de rótulo. Não é
  spinner em toda parte.
- Mensagem assíncrona precisa ser anunciada para leitor de tela (`role="alert"` para erro,
  `aria-live="polite"` para progresso e sucesso). Hoje isso está desigual.

## A camada que atravessa a área logada

A primeira versão deste mapa auditou interação **dentro** de cada tela e passou por cima do
que vale para todas elas. O Pedro apontou a falta em 28/jul. Esta seção é o conserto, e é aqui
que estão os achados mais graves, porque um problema de camada aparece em todas as telas ao
mesmo tempo.

### 🔴 O aluno vê o nome "Pedro" antes de ver o próprio

O markup portado traz **`Pedro` escrito literalmente** nos marcadores `[data-u]`, e quem troca
pelo nome real é o `AreaChrome`, num efeito de cliente. Consequência medida no dev server, com
sessão de um aluno chamado "Motor da Prova": o HTML servido em `/app` contém `>Pedro<` **duas
vezes** e o nome real **zero vezes**.

Some no instante seguinte, quando o efeito roda. Mas:

- na primeira pintura, todo aluno lê o nome de outra pessoa;
- se o JS falhar ou demorar, fica;
- o pior lugar onde isso acontece é o resultado da prova, que diz literalmente
  `Você concluiu a formação, <span data-u="first">Pedro</span>`.

Não é um placeholder que se reconhece como placeholder, tipo `{{ nome }}`: é um nome plausível
de pessoa real, então o aluno não pensa "ainda carregando", pensa "esse sistema me confundiu com
outro". Vale também para `[data-email]` e `[data-acesso]` em "Minha conta".

O conserto certo é preencher no **servidor**, onde a sessão já é conhecida, do jeito que o
`fillHome` e o `fillQuestao` já fazem com outros dados, deixando o `AreaChrome` só para o que
depende de interação. Enquanto isso não acontece, o mínimo é o porte emitir marcador neutro em
vez de "Pedro".

### 🔴 Não existe `loading.tsx`, `error.tsx` nem `not-found.tsx` em nenhum lugar do projeto

Três consequências, todas na área logada:

**Transição de rota sem sinal.** Toda tela de `/app/*` é dinâmica (o build marca todas com
`ƒ`), e cada uma faz `getUser()` mais leitura de dado antes de responder. O aluno clica num
card de módulo e, em conexão lenta, nada acontece por um tempo. Um `loading.tsx` no grupo
`(sala)` resolve de uma vez para todas as telas, com o shell escuro já pintado.

**Exceção de servidor vira a tela de erro cru do Next**, fora da marca, quebrando o shell
escuro. Isso deixou de ser hipotético em 28/jul, porque o motor da prova **estoura de
propósito** em duas situações: o `exigir` dos templates quando o porte muda o markup, e o
`abrirTentativa` quando algum módulo tem menos de 5 questões ativas. As duas decisões estão
certas (falhar alto é melhor que servir placeholder ou abrir prova curta), mas nenhuma delas
tem tela. Falta um `error.tsx` no `(sala)` que diga o que aconteceu, ofereça recarregar e
aponte o WhatsApp.

**URL inválida dá 404 padrão.** Medido: `/app/modulo/9/aula/99` e `/app/naoexiste` devolvem 404
sem passar pelo shell da área. Um `not-found.tsx` resolve.

### 🔴 Sessão que expira no meio do curso não explica nada

A guarda do `proxy.ts` manda para `/app/login` sem contexto. O aluno estava na aula 7, volta
para uma tela que diz "Bem-vindo de volta" e não entende por que foi expulso. Falta um
`?estado=expirou` que a tela de login leia, no mesmo padrão que a de recuperação de senha já
usa.

### 🟡 Guarda de acesso por matrícula não existe

O `proxy.ts` checa **se existe sessão**, não se o acesso está válido. O `PRD.md` §4 manda
`revoked` e `expired` caírem em `/app/acesso`, com o progresso preservado. Hoje um aluno com
matrícula revogada continuaria navegando normalmente. Está na fila como frente própria
(`PENDENCIAS-LP`), e o feedback dela é parte do mesmo trabalho.

## Auditoria por tela

Severidade: 🔴 o aluno fica sem saber o que aconteceu · 🟡 funciona mas hesita · ⚪ polimento.

### `/app/login` (login e primeiro acesso)

| Interação | Hoje | Falta |
|---|---|---|
| Envio do formulário | Botão desabilita e cai para `opacity .7` | 🟡 O rótulo continua "ENTRAR". Trocar para "ENTRANDO..." enquanto trabalha |
| Erro de credencial | `div` inserida antes do botão, com texto claro | 🟡 Sem `role="alert"`: leitor de tela não anuncia |
| Regra de senha no 1º acesso | Frase estática sob o campo (28/jul) | 🔴 Não indica **quais** exigências já foram cumpridas enquanto digita |
| "As senhas não conferem" | Só no envio | 🟡 Poderia avisar ao sair do segundo campo |
| Pagamento em processamento | A tela existe (`login-pending.html`) e é alcançável por `?s=pendente`, que o `login/page.tsx` já resolve | 🔴 Nada **detecta** a condição: o `?s=` só vem da URL. Um aluno com boleto pendente que erra o login recebe "E-mail ou senha incorretos" e vai procurar um problema de senha que não existe. Depende de saber o estado do pedido, então casa com a entrada do Guru |

### `/app/recuperar-senha` e `/app/redefinir-senha`

| Interação | Hoje | Falta |
|---|---|---|
| Envio do e-mail | "Enviando...", depois confirmação, campos somem | ⚪ Está coberto |
| Link inválido ou expirado | Aviso no topo, vindo de `?estado=` | ⚪ Coberto |
| Senha nova | Erro específico por exigência, no envio | 🔴 Falta o indicador progressivo das quatro exigências |
| Salvando | "Salvando..." com `aria-live` | ⚪ Coberto |

### `/app` (home)

| Interação | Hoje | Falta |
|---|---|---|
| Prova bloqueada | Modal explicando, com o número de aulas restantes | ⚪ Coberto, e é o melhor feedback do produto hoje |
| Clique num card de módulo | Navega | 🟡 Sem estado de "carregando" na transição; em conexão lenta parece que o clique não pegou |

### `/app/modulo/:m/aula/:n`

| Interação | Hoje | Falta |
|---|---|---|
| "Concluir aula" | Grava no cookie e faz `router.refresh()` | 🟡 Nada muda na hora; a tela só reage quando o refresh volta. Marcar otimista e reverter se falhar |
| Materiais | Link de download | 🟡 Sem indicação de que o arquivo começou a baixar |
| Aula sem material | O `PRD.md` §6 manda a seção sumir ou dizer "em breve" | 🔴 Não implementado |

### `/app/prova` e `/app/prova/questao/:q`

| Interação | Hoje | Falta |
|---|---|---|
| Iniciar prova | Rótulo vira "ABRINDO PROVA...", erro em caixa vermelha | ⚪ Coberto (28/jul) |
| Selecionar alternativa | Repinta na hora e desfaz se o servidor recusar | ⚪ Coberto |
| Contador de respondidas | Atualiza no clique | ⚪ Coberto |
| Cronômetro | Conta do `deadline` do banco | 🟡 Sem aviso de tempo acabando. Faltando 10 e 5 minutos merece destaque |
| Enviar prova | `window.confirm` do navegador | 🔴 Provisório e fora do design. É o momento mais tenso da jornada, tentativa única |
| Onde estou na prova | "Questão 7 de 20" e barra | 🔴 Sem grade de questões: o aluno não vê quais deixou em branco antes de enviar |

### `/app/prova/resultado`

| Interação | Hoje | Falta |
|---|---|---|
| Nota e desempenho | Reais, por módulo | ⚪ Coberto |
| Cor do percentual | Verde na variante aprovada, sempre | 🔴 **Decidido em 28/jul:** verde para sucesso, amarelo para módulo deficitário, para o aluno aprovado enxergar a área fraca de bate-pronto. Ver as medições de contraste abaixo |
| Cor do percentual, tela de reprovado | Dois níveis **fixos no HTML**: dourado escuro nas linhas 1 e 2, vermelho nas 3 e 4 | 🔴 **Bug que eu introduzi em 28/jul:** eu substituo o número e não a cor, então uma linha com 90% real herda o vermelho que o design tinha posto no 42%. Tem de colorir por valor nas duas variantes |

#### Contraste medido (28/jul), sobre o card branco

Duas falhas **anteriores a qualquer mudança minha**, que apareceram ao escolher o amarelo:

| Elemento | Cor atual | Medido | Exigência | Veredito |
|---|---|---|---|---|
| Percentual em texto de 12px | `#1F8A5B` verde | **4,33:1** | 4,5 (AA texto normal) | **falha, por pouco** |
| Barra de progresso sobre o trilho `#EDE6DD` | `#A98E4E` dourado | **2,54:1** | 3,0 (WCAG 1.4.11, objeto gráfico) | **falha** |

E o conflito do amarelo: amarelo vivo **não passa AA como texto sobre branco**, é física da cor.
O `#e0a54e` que já existe no gradiente da barra dá 2,17:1. O amarelo mais claro que passa é
`#9C660A`, com 4,86:1, e ele lê como mostarda escura, não como amarelo vibrante.

Candidatos medidos, para a decisão não ser por chute:

| Cor | Texto sobre `#fff` | Barra sobre `#EDE6DD` |
|---|---|---|
| `#1F8A5B` verde atual | 4,33 ✗ | 3,50 ✓ |
| `#1B7A50` verde um passo mais escuro | 5,32 ✓ | — |
| `#e0a54e` âmbar vivo | 2,17 ✗ | 1,76 ✗ |
| `#9C660A` âmbar que passa | 4,86 ✓ | — |
| `#96620A` âmbar escuro | 5,19 ✓ | 4,19 ✓ |

### `/app/certificado`

| Interação | Hoje | Falta |
|---|---|---|
| "Baixar PDF" | Gera com html2canvas e jsPDF. **Tem** sinal de trabalho: `opacity .6` e `pointer-events:none`, restaurados num `finally` | 🔴 Não há `catch`. Se o `html2canvas` ou o `fetch` das logos falhar, o `finally` devolve o botão ao normal e **nada é dito**, o que para o aluno é indistinguível de "o clique não funcionou". Falta a caixa de erro e um rótulo "GERANDO PDF..."; opacidade sozinha é sinal fraco para uma operação de segundos |
| "Compartilhar no LinkedIn" | Abre o fluxo oficial | ⚪ Coberto |

### `/app/conta`

| Interação | Hoje | Falta |
|---|---|---|
| "Trocar senha" | 🔴 **Não faz nada.** O comentário no `ContaClient` diz "pendente até o fluxo real" | O fluxo real existe desde 28/jul. Apontar para `/app/recuperar-senha`, ou fazer a troca com senha atual ali mesmo |
| "Falar no WhatsApp" | Link certo | ⚪ Coberto |

### Sair (chrome da área)

| Interação | Hoje | Falta |
|---|---|---|
| "Sair" | Chama `signOut` e navega | 🟡 Sem feedback entre o clique e a saída |

### `/verificar/:codigo` (público)

| Interação | Hoje | Falta |
|---|---|---|
| Código válido e inválido | As duas variantes existem | ⚪ Coberto |

### LP (`/`)

Sem formulário, então o feedback é de navegação: âncoras, acordeões do currículo, carrosséis
com bolinhas de posição, hover dos docentes. ⚪ Coberto, e foi trabalhado em 25/jul.

## Prioridade sugerida

Ordem por dano ao aluno, não por esforço. Os três primeiros são de **camada**, então cada um
conserta várias telas de uma vez, e é por isso que vêm antes dos itens de tela.

1. **O nome "Pedro" na primeira pintura.** Atinge toda a área logada e cai justamente no
   resultado da prova. Preencher no servidor.
2. **`loading.tsx`, `error.tsx` e `not-found.tsx` no grupo `(sala)`.** Três arquivos pequenos
   que dão sinal de transição, tela de erro na marca e 404 dentro do shell. O `error.tsx` virou
   necessidade concreta quando o motor da prova passou a estourar de propósito.
3. **Sessão expirada explicada** na volta ao login.
4. **"Trocar senha" da conta que não faz nada.** Botão morto é o pior feedback possível, e a
   correção agora é barata porque o fluxo existe.
5. **Certificado: `catch` no "Baixar PDF", mais rótulo de trabalho.** É a entrega final do
   curso, e falha silenciosa aí gera ticket de suporte na hora. O sinal de trabalho existe mas
   é só opacidade, fraco demais para uma operação de segundos.
6. **Indicador progressivo das exigências de senha**, nas duas telas que criam senha. É o que
   o Pedro levantou, e transforma tentativa e erro em preenchimento guiado.
7. **Modal de envio da prova**, substituindo o `window.confirm`, junto com a **grade de
   questões**. Tentativa única mais 120 minutos: é onde a ansiedade é maior.
8. **Login com pagamento pendente.** Hoje esse aluno recebe uma mensagem errada, que o manda
   procurar um problema de senha que não existe. Depende da entrada do Guru.
9. **Aula sem material** ficando "em breve" em vez de seção vazia, e o **aviso de tempo
   acabando** na prova.
10. O resto: `role="alert"` onde falta, rótulo de botão trabalhando, marcação otimista do
    concluir aula, feedback do "Sair".

## Antes de implementar

Escolher os padrões **uma vez** e registrar no `DESIGN.md` §3, para não nascerem cinco jeitos
de dizer "carregando". São quatro peças: caixa de erro, caixa de sucesso, botão em trabalho, e
a lista de exigências que marca conforme cumpre. As duas primeiras já existem quase iguais em
três clients diferentes; vale extrair.

---
_Levantado em 28/jul/2026, a pedido do Pedro. Atualizar conforme os itens caírem._
