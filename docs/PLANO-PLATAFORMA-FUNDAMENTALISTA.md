# Plano: plataforma fundamentalista dentro da área do aluno

Documento de planejamento, sem código. Escrito em 09/out/2026 a partir da leitura do source local do BlockTrends (tema `blocktrends` 2.162.3 e plugin `bt-command-center` 5.103.0), dos dossiês de completude de junho/2026 e da estrutura atual deste projeto. Preços de fornecedores verificados nas páginas oficiais em 09/out/2026; todos dependem de confirmação comercial por escrito.

Objetivo: reconstruir do zero, dentro de `/app`, a camada de dados de ações e ETFs que hoje vive no blocktrends.com.br, com dado correto e rastreável. Primeiro numa rota de homologação não linkada; depois aberta aos alunos como diferencial do curso Estratégia Internacional.

---

## 1. Resumo em dez linhas

1. O código do BT está em `BlockTrends/01 - BlockTrends/01 - BT Command Center/bt-command-center/plugin` (dados, crons, REST) e `BlockTrends/01 - BlockTrends/02 - BT Theme/blocktrends` (telas). Protótipo de fundamentos por fonte primária em `BlockTrends/api-fundamentos`.
2. A plataforma do BT tem quatro telas de dado: página de empresa, one-pager de ativo (cripto, commodity, ETF), tabela de mercados com filtros e o hub macro `/graficos/`. Não existe screener, comparador, página de país nem página de setor; país e setor são só filtros.
3. A principal fonte do BT hoje é raspagem do companiesmarketcap.com (preço, market cap, receita, lucro, P/L, dívida, setor, país). Yahoo foi abandonado em 2026 por bloqueio 429 no IP da AWS. brapi foi usado no plano grátis e trocado. Não há fornecedor pago contratado.
4. Os erros de dado do BT têm causa conhecida: moedas misturadas, "lucro" com duas definições, setores com drift, preço de até uma semana, fundamentos gravados uma vez e nunca atualizados, histórico só anual.
5. Yahoo Finance resolve cobertura e campos, mas os termos proíbem uso comercial e coleta automatizada. Não serve para exibir a aluno pagante. Não existe API paga oficial do Yahoo.
6. Recomendação: fornecedor licenciado para exibição (EODHD com contrato comercial, ou a dupla brapi Pro + Twelve Data Business), com SEC EDGAR e CVM como camada de auditoria dos fundamentos de EUA e Brasil.
7. Arquitetura: tabelas `mkt_*` no Supabase, job diário no GitHub Actions (o repo `qrcapital/abril-project` já existe), telas server-side com cache revalidado pelo job, componentes da sala (`Grafico.tsx`, `Kpis.tsx`).
8. MVP: explorar (lista com filtros), página de ação, página de ETF, metodologia e painel de saúde do dado no admin. Universo inicial de cerca de 1.100 ativos de EUA e B3.
9. Estimativa: MVP em 6 a 8 semanas de um dev, divididas em 4 fases. Comparador, screener numérico, macro e watchlist ficam para depois.
10. Nada aqui pode virar recomendação de investimento: dado descritivo, sem "comprar", sem preço-alvo, sem ranking de "melhores".

---

## 2. Onde está o código do BT

| Peça | Caminho (a partir de `Projects/BlockTrends/`) | Observação |
|---|---|---|
| Plugin, source canônico | `01 - BlockTrends/01 - BT Command Center/bt-command-center/plugin` | `includes/` tem 142 arquivos; versão no cabeçalho de `bt-news-generator.php` |
| Tema, source canônico | `01 - BlockTrends/02 - BT Theme/blocktrends` | `single-empresa.php`, `single-asset.php`, `page-mercados.php`, `page-graficos.php` |
| Protótipo de fundamentos | `api-fundamentos/` | spec, ingestores Python de EDGAR e CVM, cobertura vs catálogo |
| Dossiês de dado | raiz: `dossie-completude-*.md`, `dossie-mercados-graficos-social-2026-06.md` | estado de junho/2026 |
| Pastas `fresh/`, `dep*/`, `_deploy_tmp/` | raiz | são telas do goodhal (agenda, workout), não do BT |

Arquivos-chave do plugin para quem for portar regras:

- Catálogo e fundamentos: `includes/companies-store.php` (tabela `wp_bt_companies`), `companies-history-store.php`, `companies-cmc-*.php`, `companies-discovery.php`, `companies-sector-taxonomy.php`, `btcc-fundamentals.php` (EDGAR), `btcc-fundamentals-cvm.php` (CVM).
- REST das telas: `companies-rest.php`, `companies-page-rest.php`, `macro-rest.php`, `v6-marketcap-feed.php`.
- Macro: `macro-store.php` (catálogo de séries, linhas 66 a 186), `macro-feeds.php`, `macro-bitcoin-onchain.php`, `macro-commentaries.php`.

---

## 3. Inventário de features e prioridade

Legenda: **MVP** entra na primeira versão; **F2** fase 2, depois da abertura aos alunos; **Fora** não entra neste projeto.

### 3.1 Telas que existem no BT

| Feature no BT | O que mostra hoje | Fonte hoje | Prioridade aqui | Nota |
|---|---|---|---|---|
| Página de empresa `/empresa/{ticker}/` | Hero com país, setor, logo, preço e variação do último ano; faixa de KPIs (market cap, preço, P/L, receita TTM, lucro TTM, dívida); "a tese em uma frase"; sinais de saúde (lucrativa, dívida baixa/alta, receita e lucro crescendo); sobre a empresa; grade de fundamentos; 7 gráficos anuais (market cap, preço, receita, lucro, dívida, ativos, P/L); notícias do portal | `wp_bt_companies` e `wp_bt_company_history`, alimentadas por raspagem do companiesmarketcap, EDGAR e CVM; texto por Claude | **MVP** | Reconstruir com preço diário real (o BT deriva um preço anual a partir da variação %), P/VP, ROE, margens e dividend yield, que o BT não mostra |
| One-pager de ETF `/mercados/{symbol}/` | Só cabeçalho, gráfico e "sobre". Sem categoria, taxa, patrimônio ou carteira | Feed da QR Asset e CMC; ETFs estrangeiros desligados | **MVP, refeito** | É a tela mais pobre do BT e a mais importante para um curso de investimento internacional |
| One-pager de cripto e commodity, Raio-X (COT, on-chain, DefiLlama, derivativos, razões entre metais) | Painéis setoriais e de posicionamento | CFTC, CoinGecko, DefiLlama, blockchain.info | **Fora** | Fora do escopo "ações e ETFs" |
| Tabela `/mercados/` | Busca, filtro por tipo, país (37) e setor (38 rótulos); colunas rank, ativo, categoria, market cap em USD e BRL, preço, país; ordena só por market cap e preço; ETFs da QR fixados no topo com selo de patrocínio | `/btcc/v1/companies` | **MVP** como "Explorar" | Ordenar por mais colunas; sem bloco patrocinado na área do aluno |
| Filtros de país e setor | Selects na tabela; o breadcrumb da empresa aponta para `?country=` e `?sector=`, que a tabela ignora | Bandeira do CMC e primeira categoria do CMC | **MVP** como filtro, **F2** como página própria | |
| Hub macro `/graficos/` | 116 séries no catálogo (90 base + 26 on-chain do Bitcoin), cards com sparkline, gráfico de 10 anos, "Leitura BlockTrends", exportar PNG | BCB SGS, FRED, Tesouro, CoinGecko, DefiLlama, blockchain.info | **F2**, recorte de ~30 séries | O número divulgado oscila: 116 no código, 119 textos, 127 na página em junho. Cripto on-chain fica fora |
| Watchlists e "charts board" em `/minha-area/` | Listas nomeadas, quadro de gráficos arrastáveis, mediana de P/L por setor | user meta do WP | **F2** watchlist simples; board **Fora** | |
| Mediana de P/L por setor e país | Usada na watchlist | cálculo sobre `wp_bt_companies` | **F2** | Só depois que moeda e definição de lucro estiverem coerentes |
| Textos de IA (overview, SWOT, "Insight BlockTrends", "Leitura BlockTrends", descrição de ativo) | Gerados por Claude Sonnet, Haiku e Opus | API Anthropic | **Fora** no MVP; **F2** só texto descritivo revisado | O "Insight" cruza growth, value e momentum: é opinião e esbarra em recomendação |
| Menu "pergunte à IA" (ChatGPT, Claude, Gemini) | Monta prompt com os KPIs | front | **Fora** | |
| Calendário econômico | Agenda do dia | ForexFactory (raspagem) e FMP grátis | **Fora** | Raspagem tem o mesmo problema de termos |
| Faixa de cotações no topo | ~17 ativos a cada 5 min | brapi, FMP grátis, Stooq | **Fora** | Decisão já tomada no BT: nada de "ao vivo" |
| Notícias relacionadas | Posts do WordPress | portal | **Fora** | Não há portal neste app |
| Regwall | Parede de cadastro cosmética (REST público) | tema | **Fora** | Aqui a guarda é a matrícula, de verdade |

### 3.2 Features que o BT não tem e que fazem sentido aqui

| Feature | Prioridade | Por que |
|---|---|---|
| Página de ETF completa (categoria, emissor, índice, taxa, patrimônio, data de início, domicílio vs exposição, maiores posições, retorno por período) | **MVP** | Núcleo do curso: investir lá fora passa por ETF |
| Retorno por período (1m, 6m, no ano, 1a, 3a, 5a) com preço ajustado | **MVP** | O BT não tem série diária |
| Página "Metodologia": definição de cada número, fonte, horário de atualização, como tratamos moeda | **MVP** | É a resposta ao problema "o dado do BT nem sempre está certo" |
| Fonte e data visíveis em cada número | **MVP** | Rastreabilidade |
| Painel "saúde do dado" no admin | **MVP** | Sem ele o erro só aparece quando o aluno reclama |
| Comparador de 2 a 4 ativos | **F2** | A sala já tem `Comparativo.tsx` |
| Screener com filtros numéricos (P/L, DY, taxa, patrimônio) | **F2** | Exige cuidado de redação para não parecer indicação |
| Coleções "citados nas aulas" (ex.: ETFs mencionados no Módulo II) | **F2** | Liga o dado ao conteúdo; neutro, sem juízo |
| Gráfico de ativo embutido no notebook da aula | **F2** | Reaproveita `Grafico.tsx` |
| Exposição de ETF por país e setor | **F2** | Depende do fornecedor |
| Histórico de dividendos | **F2** | Campo morto no BT |
| Páginas de país e de categoria | **F2** | |

---

## 4. Problemas de qualidade de dado do BT (o que não repetir)

Levantados no código e nos dossiês de junho/2026:

1. **Moedas misturadas.** Fundamentos da CVM entram em reais em linhas marcadas como USD (`btcc-fundamentals-cvm.php` não converte; `companies-cmc-ingestion.php:216` e `companies-discovery.php:250` gravam `currency='USD'`). A mediana de P/L por setor mistura as duas.
2. **"Lucro" com duas definições.** No companiesmarketcap, "earnings" é lucro antes de impostos; em EDGAR e CVM é lucro líquido. O P/L derivado e os benchmarks misturam os dois.
3. **Setores com drift.** O comentário fala em 14 setores e a lista tem 38; o seed de empresas chinesas grava rótulos que não estão no mapa canônico; já houve duplicata PT/EN.
4. **Preço defasado.** O scraper de detalhe passa uma empresa a cada 5 minutos e só volta nela depois de 7 dias; fora EUA e Brasil o preço pode ter uma semana.
5. **Fundamentos gravados uma vez.** EDGAR e CVM só preenchem onde `revenue_ttm` é nulo; nunca corrigem o valor do scraper nem atualizam depois.
6. **Histórico só anual e frágil.** O gráfico de preço da empresa é reconstruído a partir da variação anual; houve casos de "sem dados" na captura.
7. **ETF sem categoria e com país errado.** Todo ETF do CMC recebe `US`; não há campo de categoria. Os 196 ETFs estrangeiros renasciam a cada cron até serem desligados.
8. **Campo morto.** `dividend_yield` nunca foi preenchido por nenhuma fonte.
9. **Hook morto.** `btcc_company_inserted` nunca dispara, então empresa nova não recebe fundamentos do EDGAR.
10. **Fonte frágil e fora dos termos.** A base inteira depende de raspar o companiesmarketcap, que pode bloquear ou mudar o HTML a qualquer momento.
11. **Contagens divergentes.** 116, 119 ou 127 indicadores; "1.500 empresas" anunciadas com ~1.413 reais.

Princípios que saem disso, e que valem como regra do projeto:

- Cada número guarda **fonte, data de referência e data de coleta**.
- Valor bruto na **moeda original**; conversão para USD ou BRL só na leitura, com câmbio da data.
- **Uma definição por métrica**, escrita na página de metodologia. Lucro é lucro líquido atribuível ao controlador.
- Métrica derivada (P/L, P/VP, DY, margens, ROE) é **calculada por nós** a partir dos brutos, nunca copiada pronta de fornecedor diferente.
- **NULL legítimo** é estado, não pendência (empresa sem lucro não tem P/L; biotech pré-receita tem receita zero).
- Correção manual só via tabela de **overrides com motivo e autor**, nunca editando o dado do fornecedor.

---

## 5. Fonte de dados

### 5.1 A ideia do Yahoo Finance, avaliada

**O que o Yahoo entrega (via `yfinance`, biblioteca Python não oficial que chama `query1/query2.finance.yahoo.com` com cookie e "crumb"):**

| Item | Cobertura |
|---|---|
| Ações EUA | Completa (NYSE, Nasdaq, ADRs) |
| Ações B3 | Sim, sufixo `.SA` (ex.: `PETR4.SA`) |
| ETFs EUA | Sim, com categoria (padrão Morningstar), família/emissor, taxa, patrimônio, maiores posições |
| ETFs B3 | Preço sim; metadado de categoria irregular |
| Preço e histórico diário | Sim, com ajuste por split e dividendo |
| Demonstrativos (DRE, balanço, fluxo de caixa) | Anual e trimestral, poucos anos |
| País, setor, indústria | Sim, no `info` |
| Dividendos e splits | Sim |

**Por que não usar em produção:**

- **Termos de uso.** Os termos do Yahoo dizem, em tradução livre: não é permitido acessar ou reutilizar os serviços "para qualquer fim comercial"; não é permitido reproduzir, distribuir ou explorar comercialmente qualquer parte do conteúdo; e não é permitido coletar dados "por meios automatizados, incluindo robôs, spiders, scrapers" sem permissão prévia. O próprio README do `yfinance` avisa que a biblioteca não tem vínculo com o Yahoo, é "para pesquisa e fins educacionais" e que a API do Yahoo é "apenas para uso pessoal". Exibir esse dado a aluno pagante de um curso com a marca VEJA é uso comercial. **Não há como fazer isso dentro dos termos.**
- **Não existe API paga oficial do Yahoo.** A API pública foi encerrada em 2017 e não foi substituída; não há o que contratar.
- **Fragilidade.** Quebras de "crumb" em 2023 e 2024, bloqueios 429 recorrentes em 2025, sem SLA. O BT já viveu isso: o Yahoo morreu no EC2 da AWS por 429 (nota da versão 4.14.3 do plugin e teste de 04/jun/2026).

Uso aceitável, se o Marcelo quiser: prototipar localmente, com uma dúzia de tickers, para validar o desenho das telas, ciente de que mesmo isso é coleta automatizada fora dos termos. Nada que vá para a homologação compartilhada nem para aluno.

> A mesma objeção vale para o companiesmarketcap que o BT raspa hoje, e para ForexFactory, Status Invest e Fundamentus.

### 5.2 Alternativas licenciadas (preços de 09/out/2026)

O ponto que decide não é o preço do plano, é a **licença de exibição a terceiros**. Planos "pessoais" de quase todos os fornecedores proíbem mostrar o dado a usuários externos, pagantes ou não.

| Fornecedor | Plano para este uso | Custo aproximado | EUA / B3 / global | Fundamentos | Metadado de ETF | Exibição comercial |
|---|---|---|---|---|---|---|
| **EODHD** | Comercial "Custom" ou Enterprise | a partir de US$ 399/mês (sob consulta); Enterprise US$ 2.499/mês | Sim / Sim (código `SA`) / Sim | Sim | Sim (categoria, taxa, alocação, posições) | Só nos planos comerciais; o "Internal use" de US$ 399 **proíbe** exibir fora da empresa |
| **Twelve Data** | Business "Venture" | US$ 149 a 499/mês | Sim / Sim (bovespa, a confirmar) / 70+ mercados | Sim (endpoint caro em créditos) | Básico; métricas de ETF no Enterprise (US$ 1.099) | **Sim**, "external display" incluído: é o único plano de prateleira com essa licença |
| **brapi.dev** | Pro anual | R$ 1.399,90/ano (~R$ 117/mês) | Não / Sim / Não | Sim, DRE, balanço, DFC desde 2009, trimestral | Cotação de ETFs B3 | Sim para apps; o FAQ ressalva que redistribuição pode exigir licença adicional |
| **FMP** | Enterprise display | sob consulta (planos pessoais de US$ 19 a 139) | Sim / a confirmar / Sim | Sim | Sim | Só com "Data Display and Licensing Agreement" |
| **Massive (ex-Polygon)** | Business | US$ 699 a 2.499+/mês | Sim / Não / Não | Sim | Parceiro, sob consulta | Só nos planos business |
| **Alpha Vantage** | sob consulta | planos pessoais US$ 50 a 250 | Sim / ? / parcial | Sim | Limitado | Só com acordo escrito |
| **SEC EDGAR** | grátis | 0 | Só EUA | Sim (XBRL, histórico completo) | Não | Sim, dado público |
| **CVM Dados Abertos** | grátis | 0 | Só Brasil | Sim (DFP, ITR) | Cadastro de fundos | Sim, licença ODbL com atribuição |
| **BCB SGS / PTAX** | grátis | 0 | Câmbio e macro BR | n/a | n/a | Sim; já usado em `app/api/dolar` |

Alerta B3: a política de market data da B3 tem versão nova vigente a partir de 01/11/2026 (Ofício Circular 036/2026-PRE). Redistribuir cotação exige distribuidor licenciado. Não confirmamos se fechamento diário está isento. Comprar de fornecedor que já paga a licença B3 resolve; confirmar por escrito.

Alerta FRED (para a fase macro): parte das séries no FRED tem copyright de terceiros (S&P 500, Dow Jones, índices ICE BofA de spread). O BT exibe várias. Para o curso, usar só séries de domínio público ou de fonte oficial.

### 5.3 Recomendação

**Plano A, um fornecedor:** EODHD com contrato comercial "Custom" que cubra exibição a usuários logados pagantes, para preço diário, cadastro (país, setor, indústria, categoria de ETF, emissor, taxa) e fundamentos de EUA e B3. Vantagens: um contrato, um formato, cobertura global pronta para a fase 2, endpoint de fechamento em lote por bolsa (uma chamada traz a bolsa inteira), metadado de ETF completo. EDGAR (EUA) e CVM (BR) entram como **auditoria**: toda semana o job compara receita e lucro anuais de uma amostra contra o arquivamento oficial e abre alerta se divergir mais de 1%. O BT já tem esse código em PHP e Python em `api-fundamentos/`; aqui seria portado para TypeScript.

**Plano B, mais barato e de prateleira:** brapi Pro para B3 (cotação, histórico, fundamentos trimestrais, licença comercial declarada) mais Twelve Data Business Venture para EUA e ETFs (licença de exibição externa incluída), com EDGAR e CVM como auditoria igual ao plano A. Custo estimado de US$ 170 a 520/mês. Desvantagem: dois formatos, metadado de ETF mais pobre, cobertura global limitada.

**Plano C, sem fornecedor de fundamentos:** EDGAR e CVM como fonte principal de fundamentos (grátis, a mais correta que existe), preço e ETF por fornecedor licenciado mais barato. É o caminho de `api-fundamentos/API-Fundamentos-Spec.md`. Funciona bem para EUA e BR, mas a normalização (tags XBRL divergentes, restatements, IFRS de ADR) vira trabalho nosso permanente. Não recomendo para o MVP; serve de plano de contingência para fundamentos.

Em qualquer plano, a arquitetura tem **adaptadores por fonte**: trocar de fornecedor muda um arquivo, não as tabelas nem as telas.

Pendência antes de assinar: pedir ao EODHD (e, em paralelo, à Twelve Data) confirmação escrita de que o plano cobre "exibição de dado de fim de dia, cadastro e fundamentos a até N mil usuários logados pagantes, em produto da BlockTrends com a marca VEJA Negócios", e que a licença B3 está incluída.

---

## 6. Como o abril-project entra

### 6.1 O que já existe e será reaproveitado

- **Guarda.** O grupo `app/app/(sala)/` exige matrícula ativa (`getMatricula()`) e aceite de termos. Todo admin também tem matrícula, então passa. Papéis em `lib/admin.ts` (`papelAtual()`: admin, observador, aluno).
- **Padrão de rota oculta.** O admin usa `notFound()` para quem não tem papel; a rota nem confirma que existe. É o padrão para a homologação.
- **Design.** A sala usa CSS próprio injetado (`app/app/_ui/sala.css`, escopo `.sl`, tokens `--sl-*`, Jost, papel creme e vermelho VEJA `#C1121F`), sem Tailwind. Componentes prontos em `app/app/_ui/sala/`: `Grafico.tsx` (SVG puro, várias séries, escala log, teclado, tabela acessível), `Kpis.tsx`, `Comparativo.tsx`, `Matriz.tsx`, `Origem.tsx` (atribuição de fonte). Padrões de feedback em `app/app/_ui/feedback.tsx` e `docs/DESIGN.md` §3.
- **Job agendado.** Já existe uma Netlify scheduled function (`netlify/functions/avisos-modulo.mts`), mas o limite de 30 segundos não comporta a ingestão.
- **Fonte oficial já em uso.** `app/api/dolar/route.ts` lê PTAX do BCB com faixa de sanidade. A mesma lógica serve para o câmbio de conversão.
- **Convenções.** Lógica pura em módulo sem IO (para rodar em `npm run check`), checagem `scripts/*-check.mts`, migrations numeradas `00NN_nome.sql` idempotentes, `revoke execute ... from public` em toda função nova, escrita só por service role.

### 6.2 Rotas propostas

| Rota | Tela | Fase |
|---|---|---|
| `/app/dados` | Explorar: busca e lista com filtros | MVP |
| `/app/dados/acao/[simbolo]` | Página de ação | MVP |
| `/app/dados/etf/[simbolo]` | Página de ETF | MVP |
| `/app/dados/metodologia` | Fontes, definições, horários, política de correção | MVP |
| `/admin/dados` | Saúde do dado: última execução, contagens, alertas abertos, overrides | MVP |
| `/app/dados/comparar` | Comparador | F2 |
| `/app/dados/pais/[iso]`, `/app/dados/categoria/[slug]` | Páginas de país e categoria | F2 |
| `/app/dados/indicadores` | Macro recortado | F2 |

O nome `dados` é provisório (decisão do Marcelo, seção 11). Símbolo na URL em minúsculas com sufixo de bolsa quando não for EUA: `aapl`, `petr4.sa`, `ivvb11.sa`.

**Homologação sem link:** um `layout.tsx` em `app/app/(sala)/dados/` que chama `papelAtual()` e devolve `notFound()` para quem não é admin ou observador, enquanto a flag de abertura estiver desligada. A flag mora no banco (tabela de configuração lida por uma função `pode_ver_dados()`), para que abrir aos alunos seja mudança de dado e não deploy. O link no menu da sala (`chrome-top.html`) só entra na abertura.

A RLS das tabelas `mkt_*` usa a mesma função: `select` liberado para `pode_ver_dados()`, que devolve verdadeiro para admin e observador sempre e para `has_active_access()` quando a flag estiver ligada. Escrita só pela service role.

### 6.3 Modelo de tabelas (Supabase, prefixo `mkt_`)

Nomes em inglês, snake_case, plural, como as demais tabelas do projeto.

**Cadastro**

- `mkt_instruments`: `id`, `symbol` (canônico, ex. `PETR4.SA`), `vendor_symbol`, `name`, `kind` (`stock`, `etf`, `bdr`, `adr`), `exchange`, `currency`, `country_domicile` (ISO-2, sede ou domicílio), `country_exposure` (ETFs: país ou região de exposição), `sector_id`, `industry_raw`, `etf_category_id`, `issuer`, `isin`, `cik`, `cvm_code`, `universe` (text[]: `sp500`, `ibov`, `etf_us_top`, `curso`), `description`, `website`, `logo_url`, `is_active`, `listed_at`, `delisted_at`, `source`, `updated_at`.
- `mkt_countries`: `iso2`, `name_pt`, `region`.
- `mkt_sectors`: `id`, `slug`, `name_pt` (11 setores no padrão GICS, em português). `mkt_sector_map`: `source`, `raw_value`, `sector_id`. Valor sem mapa vai para fila de curadoria, nunca para um setor "Outros" silencioso.
- `mkt_etf_categories`: `id`, `slug`, `name_pt`, `asset_class` (ações, renda fixa, commodities, multiativos, cripto), `region` (EUA, global, desenvolvidos, emergentes, Brasil, país), `style` (amplo, setorial, dividendos, fator, tema). `mkt_etf_category_map` igual ao de setores. Os ETFs da B3 precisam de mapa curado à mão (algo como 100 a 150 linhas).

**Mercado**

- `mkt_prices_daily`: `instrument_id`, `date`, `close`, `adj_close`, `volume`; chave `(instrument_id, date)`. Abertura, máxima e mínima ficam de fora: não há tela que use e dobram o volume.
- `mkt_fx_daily`: `pair`, `date`, `rate` (USD/BRL do PTAX; outros pares se a fase global entrar).
- `mkt_dividends` (F2): `instrument_id`, `ex_date`, `pay_date`, `amount`, `currency`.
- `mkt_splits`: `instrument_id`, `date`, `ratio` (necessário para a checagem de salto de preço).

**Fundamentos**

- `mkt_fundamentals`: `instrument_id`, `period_end`, `period_type` (`FY`, `Q`), `fiscal_year`, `fiscal_quarter`, `currency`, `revenue`, `gross_profit`, `operating_income`, `net_income` (atribuível ao controlador), `eps_diluted`, `total_assets`, `total_liabilities`, `total_equity`, `total_debt`, `cash`, `operating_cash_flow`, `capex`, `dividends_paid`, `shares_outstanding`, `source`, `filed_at`; chave `(instrument_id, period_end, period_type, source)`.
- `mkt_etf_profiles`: `instrument_id`, `as_of`, `expense_ratio`, `aum`, `aum_currency`, `inception_date`, `index_tracked`, `holdings_count`.
- `mkt_etf_holdings`: `instrument_id`, `as_of`, `rank`, `holding_symbol`, `holding_name`, `weight`.
- `mkt_etf_exposures` (F2): `instrument_id`, `as_of`, `kind` (`country`, `sector`), `key`, `weight`.

**Derivados (reconstruídos pelo job todo dia)**

- `mkt_snapshot`: uma linha por ativo com tudo o que a lista e o cabeçalho precisam: último fechamento e data, retornos 1m/6m/ano/1a/3a/5a, máxima e mínima de 52 semanas, market cap em moeda original e em USD, receita e lucro TTM, P/L, P/VP, DY, margem líquida, ROE, dívida/patrimônio, taxa e patrimônio (ETF), flags de NULL legítimo, `data_quality` (ok, defasado, em revisão). Índices para os filtros e ordenações da lista.

**Operação**

- `mkt_ingest_runs`: `id`, `job`, `started_at`, `finished_at`, `status`, `counts` (jsonb), `errors` (jsonb).
- `mkt_quality_issues`: `id`, `instrument_id`, `field`, `rule`, `value`, `expected`, `severity`, `status` (aberto, aceito, resolvido), `created_at`.
- `mkt_overrides`: `instrument_id`, `field`, `value`, `reason`, `author`, `created_at`. Aplicado pelo job por cima do dado do fornecedor e sinalizado no admin.
- `app_flags` (ou equivalente): chave `plataforma_dados_aberta`.

**Volume.** Para ~1.100 ativos, 5 anos de fechamento diário dão perto de 1,4 milhão de linhas, algo como 150 a 200 MB com índice; 10 anos, o dobro. O plano grátis do Supabase tem 500 MB para o banco inteiro. Se o projeto de produção estiver no grátis, ou limitamos o histórico diário a 5 anos (e mensal antes disso) ou passamos para o Pro (US$ 25/mês, 8 GB). Decisão na seção 11.

### 6.4 Job de ingestão

**Onde roda:** GitHub Actions, workflow agendado no repo `qrcapital/abril-project`. Motivos: sem limite de 30 segundos (a função agendada do Netlify tem), Node 22 igual ao do projeto, segredos no próprio GitHub, log de cada execução, botão de rodar manualmente. Alternativa: Supabase `pg_cron` disparando uma Edge Function em lotes; funciona, mas espalha lógica entre banco e função e exige fila.

**Código:**

- `lib/mkt/` com lógica pura, sem IO: normalização, mapa de setores e categorias, cálculo de métricas derivadas, regras de qualidade. Coberto por `scripts/mkt-check.mts` no `npm run check`, como manda o AGENTS.md.
- `lib/mkt/fontes/` com um adaptador por fonte (`eodhd.ts` ou `brapi.ts` + `twelvedata.ts`, `edgar.ts`, `cvm.ts`, `bcb.ts`), todos devolvendo o mesmo formato interno.
- `scripts/mkt/ingestao.mts` orquestra e escreve no Supabase com a service role.

**Agenda (horário de Brasília):**

| Quando | Etapa |
|---|---|
| Diário, 22h (depois do fechamento de B3 e NYSE) | 1. Câmbio PTAX do dia. 2. Fechamento em lote por bolsa (EUA e B3). 3. Splits e dividendos do dia. 4. Recalcula `mkt_snapshot`. 5. Regras de qualidade. 6. Publica (revalida o cache) só se as regras de bloqueio passarem |
| Diário, mesmo job, em lotes | Fundamentos só de quem tem balanço novo provável (último período com mais de ~95 dias, ou data de resultado conhecida) |
| Semanal, domingo | Sincroniza o universo (entradas, saídas, mudanças de ticker), perfis e carteiras de ETF, auditoria de amostra contra EDGAR e CVM |
| Manual | Reprocessar um ativo; carga inicial do histórico |

**Regras de qualidade (exemplos):**

- Bloqueiam a publicação: universo cai mais de 3% de um dia para o outro; mais de 5% dos ativos sem fechamento do dia útil; câmbio fora da faixa de sanidade.
- Viram alerta e marcam o ativo como "em revisão": preço menor ou igual a zero; variação diária acima de 40% sem split registrado; market cap divergindo mais de 10% de preço vezes ações; moeda do fundamento diferente da moeda de listagem sem conversão explícita; último balanço com mais de 15 meses; ETF sem categoria; divergência acima de 1% contra EDGAR ou CVM na auditoria.
- Nunca bloqueiam: NULL legítimo (sem lucro, pré-receita, banco sem dívida comparável), que vira flag e texto na tela.

**Cache:** os dados de mercado não variam por aluno. As telas checam a guarda e depois leem por um módulo server-only com cache por etiqueta (`mkt`), que o job invalida no fim chamando uma rota interna protegida por segredo. Antes de escolher entre `unstable_cache` e `"use cache"`, ler `node_modules/next/dist/docs/` (Next 16, como pede o AGENTS.md). `revalidate`, se usado, tem que ser literal. A lista lê sempre de `mkt_snapshot` com paginação no servidor: uma consulta por tela.

---

## 7. Telas do MVP

Todas na identidade da sala (papel creme, tinta, um vermelho), desktop primeiro, com a fonte e a data de cada bloco via `Origem.tsx`. Copy passa pelo `docs/COPY.md`. Nenhuma tela diz "ao vivo" ou "tempo real": a regra do BT vale aqui, a atualização é diária.

### 7.1 Explorar (`/app/dados`)

- Busca por nome ou ticker.
- Abas: Ações, ETFs.
- Filtros: país, bolsa, setor (ações), classe, região e estilo (ETFs), universo (S&P 500, Ibovespa, citados no curso na F2).
- Colunas de ação: ativo, país, setor, market cap (USD e BRL), P/L, DY, retorno em 1 ano. Colunas de ETF: ativo, categoria, emissor, taxa, patrimônio, retorno em 1 ano.
- Ordenação por qualquer coluna numérica; ordem padrão por market cap ou patrimônio, sem rótulo de "ranking".
- Filtros refletidos na URL, para que links funcionem (o breadcrumb do BT aponta para filtros que a tabela ignora).
- Rodapé: "Dados de fechamento de DD/MM. Fonte: X." e link para a metodologia.

### 7.2 Página de ação (`/app/dados/acao/[simbolo]`)

- Cabeçalho: nome, ticker, bolsa, país, setor e indústria, moeda; fechamento e data; retornos por período.
- Gráfico de preço ajustado (1a, 5a, máximo) com `Grafico.tsx`; opção de escala log.
- KPIs (`Kpis.tsx`): market cap, P/L, P/VP, DY, margem líquida, ROE, dívida/patrimônio. Cada um com "como ler" ligando ao glossário do curso quando o termo existir lá.
- Histórico anual: receita, lucro líquido, margem líquida, dívida; gráfico e tabela com fonte por linha.
- Sobre: descrição do fornecedor (idioma: decisão 11), site, sede.
- Aviso fixo (seção 8.3).

### 7.3 Página de ETF (`/app/dados/etf/[simbolo]`)

- Cabeçalho: nome, ticker, bolsa, emissor, categoria, índice de referência, domicílio e exposição (ex.: IVVB11, domiciliado no Brasil, exposição EUA).
- Taxa de administração, patrimônio, data de início, número de posições.
- Gráfico e retornos por período.
- Dez maiores posições, com link quando a posição existir no universo.
- "Outros ETFs da mesma categoria", ordenados por patrimônio, sem juízo.

### 7.4 Metodologia (`/app/dados/metodologia`)

Definição de cada número, fórmula das derivadas, fonte por campo, horário de atualização, tratamento de moeda e de NULL legítimo, como reportar erro.

### 7.5 Saúde do dado (`/admin/dados`)

Última execução por etapa, contagens, alertas abertos por severidade, ativos "em revisão", overrides ativos, resultado da última auditoria EDGAR/CVM. Visível para admin e observador.

### Universo inicial sugerido (~1.100 ativos)

S&P 500 e o que faltar do Nasdaq-100 (~540); ~250 ETFs americanos com maior patrimônio, cobrindo amplo mercado, setores, renda fixa, países, dividendos, commodities e cripto à vista; Ibovespa e IBrX-100 (~100); todos os ETFs listados na B3 (~100 a 150); BDRs de ETF e as BDRs mais negociadas (~100). A fase 2 abre para o restante da B3 e, se o fornecedor permitir, para os ~37 países que o BT cobre.

---

## 8. Riscos

### 8.1 Dados

| Risco | Mitigação |
|---|---|
| Fornecedor erra (split mal aplicado, unidade, ticker trocado) | Regras de qualidade, auditoria contra EDGAR e CVM, estado "em revisão" na tela, overrides com motivo |
| Mistura de moeda (ADR, BDR, empresa que reporta em USD na CVM) | Moeda original sempre gravada; conversão só na leitura; regra que barra cálculo entre moedas diferentes |
| Definições divergentes entre fontes | Uma definição por métrica, cálculo próprio das derivadas, uma fonte principal por campo |
| Job falha em silêncio | `mkt_ingest_runs`, painel no admin, e-mail de alerta pelo SES que o projeto já usa |
| Dado velho exibido como novo | Data do fechamento em toda tela; ativo sem atualização há mais de 3 dias úteis sai do filtro padrão |
| Escopo cresce até virar o BT inteiro | Fases com corte explícito; cripto, on-chain e calendário fora |

### 8.2 Termos de uso e licença

- Yahoo, companiesmarketcap, ForexFactory, Status Invest e Fundamentus: proibido uso comercial e raspagem. Não usar no produto.
- Plano pessoal de qualquer fornecedor: não cobre exibição a aluno. Só plano com licença de exibição, confirmada por escrito.
- B3: confirmar se o fechamento diário entra na política de market data nova (vigência 01/11/2026), ou garantir que o fornecedor já paga.
- FRED: evitar séries com copyright de terceiros na fase macro.
- CVM (ODbL): atribuição obrigatória na metodologia.
- O contrato precisa nomear o produto e a marca (BlockTrends com VEJA Negócios), e o número de usuários.

### 8.3 Recomendação de investimento

Conteúdo que recomende compra ou venda de valor mobiliário pode ser enquadrado como análise de valores mobiliários, atividade que exige analista credenciado (Resolução CVM 20/2021). Além do risco regulatório, o curso carrega a marca VEJA. Regras para o projeto, a validar com o jurídico da BlockTrends e da Abril:

- Nada de "comprar", "vender", "manter", preço-alvo, nota, estrelas, semáforo de "barato/caro" ou "oportunidade".
- Sem listas chamadas "melhores", "top picks" ou "para investir agora". Ordenar por patrimônio ou market cap é ordem, não indicação, e o rótulo deve dizer isso.
- Screener (F2) sem estratégias pré-montadas com nome de tese ("ações baratas", "dividendos seguros").
- Sinais automáticos como os do BT ("dívida alta", "lucro crescendo") só como descrição do número, sem juízo; na dúvida, ficam fora.
- Textos de IA opinativos (o "Insight BlockTrends") ficam fora. Na F2, se entrar texto gerado, só descritivo e revisado.
- Aviso fixo em todas as telas, algo como: "Conteúdo educacional. Os dados são informativos e não constituem recomendação de investimento." Texto final com o jurídico.
- "Citados nas aulas" (F2) descreve o que o professor mencionou, sem endosso.

### 8.4 Operação

- Commit e push só com ordem do Pedro (`docs/memoria-claude/commit-push-so-com-ordem.md`); a branch `homolog` publica o domínio público. A rota oculta continua oculta mesmo publicada, por isso a guarda de papel é obrigatória desde o primeiro deploy.
- Segredos do fornecedor e a service role ficam nos segredos do GitHub e do Netlify, nunca no repo.
- Custo novo recorrente: fornecedor, possivelmente Supabase Pro.

---

## 9. Estimativa em fases

Base: um dev com Claude, em tempo integral, conhecendo o projeto.

| Fase | Entregas | Duração |
|---|---|---|
| **0. Decisões e contrato** | Decisões da seção 11; cotação e confirmação de licença; teste do fornecedor com 20 tickers de EUA e B3 (ações, ETFs, ADR, BDR) | 1 semana (prazo comercial pode alongar) |
| **1. Fundação de dados** | Migrations `mkt_*` com RLS e `pode_ver_dados()`; adaptadores; job no GitHub Actions; carga inicial do histórico; métricas derivadas; regras de qualidade; `mkt-check`; painel `/admin/dados` | 2 a 3 semanas |
| **2. Telas do MVP em homologação** | Explorar, ação, ETF, metodologia; guarda de papel; cache por etiqueta; verificação desktop e mobile; comparação de 50 tickers entre BT, plataforma nova e arquivamentos oficiais, com relatório de divergências | 2 a 3 semanas |
| **3. Abertura aos alunos** | Aviso legal aprovado; copy revisada; flag ligada; link no menu da sala; monitoramento da primeira semana | 1 semana |
| **MVP total** | | **6 a 8 semanas** |
| **4. Fase 2** | Comparador; screener; coleções "citados nas aulas"; gráfico de ativo no notebook; exposição de ETF por país e setor; dividendos; páginas de país e categoria; macro recortado (~30 séries BCB e FRED de domínio público); watchlist | 4 a 6 semanas, em partes |

A comparação da fase 2 serve também para medir, com número, o quanto o dado do BT diverge: insumo para decidir se o WordPress passa a consumir esta base no futuro.

---

## 10. Arquitetura em uma figura

```
Fornecedor licenciado ─┐
(preço, cadastro,      │
 fundamentos, ETF)     │
SEC EDGAR / CVM ───────┼──> GitHub Actions (diário 22h, semanal domingo)
(auditoria)            │      lib/mkt (puro) + lib/mkt/fontes (adaptadores)
BCB PTAX ──────────────┘      │
                              ├─> Supabase: mkt_instruments, mkt_prices_daily,
                              │   mkt_fundamentals, mkt_etf_*, mkt_snapshot,
                              │   mkt_quality_issues, mkt_ingest_runs
                              └─> invalida cache "mkt"
                                        │
Next 16 no Netlify: /app/dados/* (guarda de matrícula + papel/flag)
                    /admin/dados (saúde do dado)
```

(Os traços acima são desenho de caixa, não pontuação.)

---

## 11. Decisões que só o Marcelo pode tomar

1. **Fonte de dados.** Plano A (EODHD comercial), plano B (brapi Pro + Twelve Data Business) ou insistir no Yahoo sabendo que descumpre os termos. Qual o teto de custo mensal.
2. **Quem contrata.** BlockTrends, QR Capital ou Abril; e se o contrato precisa citar a marca VEJA Negócios.
3. **Universo.** Só EUA e B3 no MVP (recomendado) ou já global como o BT; quais índices e quantos ETFs.
4. **Histórico.** Quantos anos de preço diário, o que define se o Supabase de produção precisa ir para o Pro.
5. **Onde roda o job.** GitHub Actions no repo `qrcapital/abril-project` (quem administra os segredos) ou Supabase cron.
6. **Moeda de exibição.** Moeda original com USD ao lado, ou opção de ver tudo em BRL.
7. **Taxonomia.** Aceitar 11 setores padrão GICS em português e as categorias de ETF propostas; quem mantém o mapa curado dos ETFs da B3.
8. **Texto de IA.** Fora do MVP (recomendado). Na fase 2, se entra e com qual revisão.
9. **Idioma das descrições.** Inglês do fornecedor, tradução automática revisada, ou sem descrição no MVP.
10. **Acesso.** Só matrícula ativa, ou também quem já concluiu e teve o acesso expirado.
11. **Nome e lugar no menu.** "Dados", "Mercados" ou outro; se aparece "BlockTrends" na área.
12. **Aviso legal.** Quem revisa (jurídico da BlockTrends, da Abril, ou ambos).
13. **Relação com o blocktrends.com.br.** A base nova fica só no curso, ou vira a fonte única que o WordPress passa a consumir mais tarde, aposentando a raspagem do companiesmarketcap.
14. **Time.** Quem implementa (Pedro, outro dev, Claude com revisão do Pedro) e a regra de commit e deploy durante a homologação.
