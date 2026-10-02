# Certificado de conclusão

Notas de pesquisa e decisões do redesenho de out/2026. A folha mora em `app/_certificado/Folha.tsx`
(CSS em `app/_certificado/certificado.css`), o texto e as constantes em `lib/certificado.ts`, o QR em
`lib/qr.ts`. Prévia sem aluno: `/admin/certificado` (só admin; `?nome=` troca o nome de amostra).

## (a) Anatomia: o que um certificado sério traz

**Obrigatório, em todas as fontes consultadas:**

- **Nome completo do aluno**, o maior elemento da folha. Coursera, edX, Alura e Hotmart travam o nome
  depois da emissão ([certifier.io sobre o Coursera][certifier], [Hotmart][hotmart], [Alura][alura]).
- **Nome do curso.**
- **Instituição emissora**, com nome e marca. O Coursera abre com o logo do emissor; o edX mostra a
  organização que criou o curso ([edX][edx]).
- **Data de conclusão ou de emissão** ([Hotmart][hotmart], [Alura][alura]).
- **Carga horária.** É convenção brasileira, não internacional: Alura, XP, GINEAD e eadbox imprimem; o
  edX diz explicitamente que não mostra horas ([XP Educação][xp], [GINEAD][ginead], [eadbox][eadbox]).
- **Assinatura de um responsável.** Coursera (instrutor), edX (de um a quatro signatários), Harvard
  ManageMentor (vice-presidente da Harvard Business Publishing), XP (direção acadêmica). Há quem só
  aceite o certificado para horas complementares com assinatura do responsável ([Univesp][univesp]).
- **Código único com verificação pública** por URL e/ou QR. O Coursera põe a URL no canto inferior
  direito; o edX dá uma URL por certificado; o Alura imprime a URL na lateral; a Hotmart autentica por
  QR; a HBS Online emite PDF assinado digitalmente com página de verificação ([HBS Online][hbs-verif]).

**Opcional, mas comum no Brasil:** CPF do aluno (GINEAD na frente, XP no verso); razão social e CNPJ
do emissor; a menção a "curso livre" ([GINEAD][ginead], [LIT/Saint Paul][lit]); base legal (LDB e
Decreto 5.154/2004); conteúdo programático no verso; período do curso; cidade e data
([Prepara][prepara], [eadbox][eadbox]).

**Ressalvas que emissores sérios escrevem:** o Coursera deixa claro que o certificado não dá crédito
acadêmico ([blog do Coursera][coursera-blog]); Harvard Online e HBS Online, que ele não torna ninguém
aluno ou ex-aluno ([Harvard Online][harvard-faq], [HBS][hbs-alumni]). Nenhum deles imprime nota: o edX
diz que o certificado não inclui nota ([edX][edx]).

## (b) Convenções de layout

- **Hierarquia:** emissor e marca no topo; nome do aluno como o maior texto; uma frase formal de
  conclusão; o nome do curso; assinaturas e data embaixo; código e URL em corpo pequeno, num canto
  ([certifier.io][certifier]).
- **Estilo:** fundo claro, texto escuro, serifa no título e sans no corpo. Sem fonte manuscrita, sem
  linguagem de venda.
- **Bloco de verificação no canto ou na borda** (Coursera embaixo à direita, Alura na lateral direita).
- **Orientação:** paisagem é o mais comum nos exemplos, mas nenhuma fonte primária a exige (a Hotmart usa
  retrato por padrão). A4 deitado é escolha nossa.
- **Segurança:** código único, QR para a página de verificação, URL permanente. A HBS ainda assina o
  PDF digitalmente.

## (c) O que evitar

1. **Dar a entender reconhecimento do MEC.** Curso livre é educação não formal, sem regulação nem
   supervisão do MEC; pode emitir certificado, não diploma, e anunciar "reconhecido pelo MEC" é
   propaganda enganosa pelo CDC ([nota do MEC, set/2026][mec], [republicada][mec-rep]).
2. **Citar o Decreto 5.154/2004 como se ele enquadrasse o curso.** O §1º do art. 3º fixa 160 horas para
   cursos FIC organizados em itinerários; um curso de 30 horas não é "qualificação profissional" nesse
   sentido ([Decreto 5.154/2004][decreto]). Por isso a folha não cita lei nenhuma.
3. **"Certificação" ou "diploma".** O nome certo é certificado de conclusão; "certificação" sugere
   habilitação profissional, e os nossos Termos dizem o contrário (cláusulas 1.2 e 6.2).
4. **Nota ou "aprovado"** quando não há avaliação. Diga o critério real: concluiu todas as aulas.
5. **Assinatura ou nome inventado.** Um documento verificável com rubrica decorativa é pior que uma linha
   em branco.
6. **Prometer horas complementares.** Quem aceita é cada instituição ([Alura][alura], [Univesp][univesp]).

## (d) Decisões para o nosso

- **A4 deitado, uma página**, desenhado em milímetros (`--mm` = 1/297 da largura, via container query).
  A mesma peça serve a tela, o PDF (html2canvas + jsPDF, agora num A4 de 297 x 210 mm de verdade) e a
  impressão (`@page` A4 landscape, margem zero, `print-color-adjust: exact`).
- **Campos:** "Certificado de conclusão"; "Certificamos que"; nome completo (Playfair, corpo de 14 a
  8,5 mm conforme o tamanho); "concluiu todas as aulas da formação"; **Estratégia Internacional**
  (Playfair); "curso livre de 30 horas sobre investimento no exterior, oferecido pela VEJA Negócios em
  parceria com o BlockTrends."; data de conclusão por extenso no fuso de São Paulo.
- **Carga horária 30 horas** (`HORAS` em `lib/certificado.ts`). Conferido: a LP diz "Uma formação de 30
  horas" e "certificado de conclusão de 30h"; não há "mais de 30h" no código.
- **Emissores:** o lockup do site (VEJA Negócios | Estratégia Internacional) no topo, BlockTrends e Grupo
  Abril à direita; razão social e CNPJ das duas contratadas no rodapé, como estão nos Termos.
- **Assinaturas:** duas linhas, VEJA Negócios e BlockTrends. Nome e cargo saem de `ASSINATURAS` em
  `lib/certificado.ts`, hoje vazios (TODO do dono, com aval do jurídico); vazios, a folha mostra só a
  organização.
- **Verificação:** código `EI-XXXX-XXXX`, QR (nível M, versão 4) para
  `https://blocktrends.abril.com.br/verificar/<codigo>`, e no PDF a área do QR é link clicável. O domínio
  é constante, não variável de ambiente: PDF baixado em homologação tem de verificar em produção.
- **Ressalva curta no rodapé**, com a redação dos Termos: curso livre, educacional, sem certificação
  profissional nem recomendação de investimento.
- **Fora, de propósito:** CPF (a verificação pública mostraria um dado que não precisa mostrar),
  cidade (as emissoras ficam em São Paulo e no Rio, e a emissão é online), conteúdo programático no
  verso (pode entrar depois como segunda página), assinatura digital do PDF.
- **Identidade:** papel `#f7f4ee`/`#fdfbf6`, tinta `#1a1815`, secundário `#6b655c`, filete dourado
  `#a98e4e`, vermelho `#C1121F` só no traço sobre o título; globo dourado a 7% de opacidade como marca
  d'água.
- **Prévia:** `/admin/certificado`, atrás da guarda do admin, sem leitura nem escrita no banco; código
  `EI-0000-0000` (o `0` está fora do alfabeto, nunca é emitido) e carimbo "Exemplo" na folha.

[certifier]: https://certifier.io/blog/coursera-certificate-sample
[coursera-blog]: https://blog.coursera.org/the-anatomy-of-a-verified-certificate-shareable
[edx]: https://edx.readthedocs.io/projects/open-edx-learner-guide/en/named-release-cypress/SFD_certificates.html
[hbs-verif]: https://online.hbs.edu/credential-verification
[hbs-alumni]: https://www.hbs.edu/about/academic-programs/degrees-certifications-alumni-status
[harvard-faq]: https://www.harvardonline.harvard.edu/faq
[alura]: https://suporte.alura.com.br/tudo-que-voc%C3%AA-precisa-saber-sobre-os-certificados-alura
[hotmart]: https://suportehotmart.zendesk.com/hc/pt-br/articles/115003666771-Como-configurar-um-certificado-para-o-meu-curso
[xp]: https://suporte.xpeducacao.com.br/hc/pt-br/articles/16695186603803-Certificado-de-conclus%C3%A3o-de-curso
[lit]: https://hub.lit.com.br/combo-top-cursos-saint-paul-lit
[ginead]: https://www.ginead.com.br/certificados
[prepara]: https://prepara.com.br/blog/carreira/certificado-curso-gratuito-aceito-por-empresas/
[eadbox]: https://eadbox.com/como-emitir-certificados-para-cursos/
[univesp]: https://assets.univesp.br/documentos-graduacao/atividades-praticas/regras/Regras_Certificacoes-Extracurriculares_Eixo-da-Computacao.pdf
[decreto]: https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/decreto/d5154.htm
[mec]: https://www.gov.br/mec/pt-br/assuntos/noticias/2026/setembro/regulacao-e-supervisao-do-mec-nao-se-aplicam-a-cursos-livres
[mec-rep]: https://conexaomt.com/educacao/regulacao-e-supervisao-do-mec-nao-se-aplicam-a-cursos-livres/
