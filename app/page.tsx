import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Estratégia Internacional | Dolarização de patrimônio com método",
  description:
    "Formação em dolarização de patrimônio e investimento internacional, com quatro especialistas que operaram esse mercado por dentro. Chancela editorial da VEJA Negócios, conteúdo BlockTrends.",
  openGraph: {
    title: "Estratégia Internacional",
    description: "Sua liberdade financeira começa pela geografia.",
    type: "website",
  },
};

const CHECKOUT = process.env.NEXT_PUBLIC_CHECKOUT_URL || "#oferta";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_URL || "#";
const PRECO = "R$ 397";
const PARCELAS = "10x sem juros de R$ 39,70";

// ---------------------------------------------------------------------------
// Dados
// ---------------------------------------------------------------------------
const NAV = [
  ["O Diagnóstico", "#diagnostico"],
  ["Corpo Docente", "#docentes"],
  ["A Formação", "#formacao"],
  ["Quem Assina", "#quem-assina"],
  ["FAQ", "#faq"],
] as const;

const DOCENTES = [
  {
    chip: "Módulo I · Macro & Estratégia",
    nome: "Rodolfo Bastos",
    cred: "Ex-CEO · XP Investimentos EUA",
    foto: "/docentes/bastos.webp",
    bio: "Liderou a expansão da XP nos Estados Unidos, com profundo conhecimento em produtos offshore e distribuição para o investidor brasileiro.",
  },
  {
    chip: "Módulo II · Renda Fixa & Ações",
    nome: "Tony Volpon",
    cred: "Ex-diretor · Banco Central",
    foto: "/docentes/volpon.jpg",
    bio: "Uma das maiores referências do país em macroeconomia, câmbio e política monetária, com ampla experiência em instituições nacionais e internacionais.",
  },
  {
    chip: "Módulo III · ETFs, REITs & BDRs",
    nome: "Luiz Fernando Roxo",
    cred: "Especialista em Opções · 25 anos",
    foto: "/docentes/roxo.webp",
    bio: "Economista pela FAAP e educador do mercado financeiro, um dos maiores especialistas em opções do Brasil, com mais de 25 anos de atuação.",
  },
  {
    chip: "Módulo IV · Criptoativos",
    nome: "Alexandre Ywata",
    cred: "PhD Northwestern · CRO QR Asset",
    foto: "/docentes/ywata.webp",
    bio: "Foi vice-presidente da Caixa e secretário da Economia. Especialista em econometria e análise de risco, conduz criptoativos com o rigor de quem mede antes de afirmar.",
  },
];

const MODULOS = [
  {
    num: "I",
    titulo: "Macro e Estratégia Global",
    docente: "Rodolfo Bastos",
    aulas: [
      ["01", "Por que a dolarização de ativos?", "Risco fiscal, inflação crônica e perda do valor real."],
      ["02", "O dólar como reserva de valor", "Comparativo histórico BRL x USD e hedge cambial."],
      ["03", "Conta internacional na prática", "Abertura nos EUA, remessa e câmbio no dia a dia."],
      ["04", "Carteira global e perfil de investidor", "Perfil offshore e montagem de carteira."],
    ],
  },
  {
    num: "II",
    titulo: "Renda Fixa e Ações nos EUA",
    docente: "Tony Volpon",
    aulas: [
      ["05", "Tesouro americano", "T-Bills, Notes, Bonds, TIPS e FRNs."],
      ["06", "Crédito privado internacional", "Investment grade vs. high yield, risco-retorno."],
      ["07", "Comprando ações nos EUA", "Como encontrar, analisar e selecionar stocks."],
      ["08", "Dividendos vs. growth investing", "Setores, múltiplos e quando preferir cada um."],
    ],
  },
  {
    num: "III",
    titulo: "Como Acessar o Mercado Americano",
    docente: "Luiz Fernando Roxo",
    aulas: [
      ["09", "ETFs: a forma mais barata de investir nos EUA", "Gestão ativa vs. passiva na carteira offshore."],
      ["10", "REITs: o imóvel americano na carteira", "FFO, P/FFO e comparação com FIIs."],
      ["11", "BDRs: comprando EUA pela bolsa brasileira", "Tipos e principais fundos internacionais."],
      ["12", "Tributação e sucessão internacional", "Declaração de ativos e proteção patrimonial."],
    ],
  },
  {
    num: "IV",
    titulo: "Criptoativos em Dólar",
    docente: "Alexandre Ywata",
    aulas: [
      ["13", "Bitcoin e Ethereum", "Reserva de valor vs. contratos inteligentes."],
      ["14", "Tokens, RWA e o ecossistema", "Tokenização de ativos e regulação."],
      ["15", "ETFs de cripto e análise on-chain", "ETFs spot nos EUA e métricas on-chain."],
      ["16", "Tributação de criptoativos", "Regras BR e EUA, ganho de capital, compliance."],
    ],
  },
];

const DIAGNOSTICO = [
  ["O problema", "A corrosão", "O real perdeu valor contra o dólar em quase todas as janelas longas desde o Plano Real. Patrimônio parado em uma moeda só é uma aposta, não uma escolha."],
  ["A urgência", "O custo de esperar", "Cada ciclo de câmbio que passa encarece a entrada. Diversificar depois da crise é comprar proteção pelo preço mais alto da prateleira."],
  ["A resposta", "A saída tem método", "Conta internacional, remessa, carteira global, tributação em dia. O caminho é conhecido; o que falta ao investidor comum é quem o percorra junto."],
];

const CONTRA = [
  "Vídeos soltos no YouTube, cada um dizendo uma coisa, sem ordem nem contexto para o seu caso.",
  "Remessas com spread alto e taxas escondidas que você só descobre depois.",
  "Tributação e sucessão internacional deixadas para depois; o depois costuma custar caro.",
  "Decisões tomadas no susto, no pico do dólar, quando a proteção está mais cara.",
];
const A_FAVOR = [
  "Trilha ordenada do diagnóstico à carteira, desenhada por quem operou esse mercado.",
  "O passo a passo real de conta, remessa e câmbio, sem improviso.",
  "Tributação e sucessão tratadas como parte do método, não nota de rodapé.",
  "Certificação com prova: você termina sabendo, não achando que sabe.",
];

const RECEBE = [
  "Formação completa: 4 módulos, 16 aulas, 30h+",
  "Certificação com prova avaliativa",
  "Apostila completa de cada módulo",
  "Materiais complementares para download",
  "E-book bônus exclusivo",
  "Acesso por 1 ano, no seu ritmo",
];

const FAQ = [
  ["Nunca investi fora do Brasil. A formação é para mim?", "Sim. A trilha foi desenhada para quem parte do zero em investimento internacional: o Módulo I começa no diagnóstico e te leva até a abertura de conta e a primeira remessa, antes de qualquer produto sofisticado."],
  ["Preciso já ter conta no exterior?", "Não. Abrir e operar a conta internacional é justamente uma das aulas práticas do Módulo I."],
  ["Por quanto tempo tenho acesso?", "1 ano a partir da compra, com todas as aulas, apostilas e materiais liberados para o seu ritmo."],
  ["Como funciona o certificado?", "Ao concluir as 16 aulas, você libera a prova final, que cobre os 4 módulos e exige nota mínima de 70%. Aprovado, o certificado de 30h, emitido pela BlockTrends com a chancela editorial da VEJA Negócios, sai na hora, com código de verificação."],
  ["E se eu reprovar na prova?", "Você chama nosso suporte no WhatsApp e solicita a segunda chamada. Liberamos uma nova tentativa para você refazer a prova depois de revisar o conteúdo."],
  ["Como funciona a garantia?", "7 dias de garantia incondicional, conforme o Código de Defesa do Consumidor. Dentro desse prazo, basta chamar no WhatsApp e devolvemos 100% do valor."],
  ["As aulas são ao vivo?", "Não. Todas gravadas, para assistir quando e onde quiser, com retomada automática de onde parou."],
  ["Tem suporte se eu travar em algo?", "Sim, por WhatsApp. O canal atende acesso, pagamento, certificado e segunda chamada da prova."],
];

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <b>ESTRATÉGIA</b>
      <span className="intl">Internacional</span>
    </span>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-verde-3/95 backdrop-blur-md">
      <nav className="relative mx-auto flex max-w-[1280px] items-center gap-5 px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5 text-offwhite">
          <Image src="/brand/olho.png" alt="" width={28} height={20} className="opacity-90" />
          <Wordmark className="text-[13px] text-offwhite" />
        </a>
        <input type="checkbox" id="nav" className="nav-toggle peer" aria-label="Abrir menu" />
        <div className="nav-links ml-auto flex items-center gap-1">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full px-3 py-2 text-[13px] font-semibold text-muted2 transition-colors hover:bg-gold/10 hover:text-gold-lit">
              {label}
            </a>
          ))}
          <a href="/app/login" className="rounded-full px-3 py-2 text-[13px] font-semibold text-muted2 transition-colors hover:text-gold-lit">
            Entrar
          </a>
        </div>
        <a href={CHECKOUT} className="ml-auto rounded-full grad-gold px-5 py-2.5 text-[13px] font-bold text-verde-3 lg:ml-2">
          Inscreva-se
        </a>
        <label htmlFor="nav" className="nav-hamb hidden h-10 w-10 cursor-pointer items-center justify-center text-gold-lit" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </label>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="lp-dots relative overflow-hidden grad-verde text-offwhite">
      <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {/* kicker de marcas (aprovado para a primeira dobra) */}
          <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-lit">
            <span>VEJA Negócios</span>
            <span className="text-gold/60">×</span>
            <span>BlockTrends</span>
          </p>
          <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-semibold leading-[1.0] text-balance">
            Sua liberdade financeira começa pela <em className="italic text-gold-lit">geografia</em>.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[clamp(15px,1.8vw,18px)] text-muted2">
            O método de dolarização que faltava ao investidor brasileiro, ensinado por quem operou esse mercado por dentro.
          </p>
          <div className="mt-8">
            <a href={CHECKOUT} className="inline-block rounded-[10px] grad-gold px-7 py-4 text-[15px] font-bold tracking-wide text-verde-3">
              QUERO DOLARIZAR MEU PATRIMÔNIO →
            </a>
          </div>
          <p className="mt-4 text-[13px] text-muted">Acesso imediato após a compra · garantia de 7 dias</p>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-[14px] border border-gold/25 bg-verde-2/60">
          <div className="flex h-full items-center justify-center text-center text-[13px] text-muted">
            <span>▶ Assista à apresentação</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ficha() {
  const cells: readonly (readonly [string, string, boolean?])[] = [
    ["30h+", "de conteúdo"],
    ["4 especialistas", "um por módulo"],
    ["On-demand", "no seu ritmo"],
    ["Certificado", "chancela VEJA Negócios", true],
    [PRECO, "investimento único"],
  ];
  return (
    <section id="ficha" className="bg-bege">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px overflow-hidden md:grid-cols-5">
        {cells.map(([a, b, invert], i) => (
          <div key={i} className={`px-5 py-7 text-center ${invert ? "bg-verde text-offwhite" : "bg-offwhite"}`}>
            <p className={`font-serif text-[19px] font-semibold ${invert ? "text-gold-lit" : "text-verde"}`}>{a}</p>
            <p className={`mt-1 text-[12px] ${invert ? "text-bege" : "text-medio"}`}>{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Diagnostico() {
  return (
    <section id="diagnostico" className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-dark">O diagnóstico</p>
        <h2 className="max-w-[20ch] font-serif text-[clamp(26px,4vw,44px)] font-semibold text-verde text-balance">
          Seu patrimônio está em uma moeda que trabalha contra ele.
        </h2>
        <p className="mt-4 max-w-[68ch] text-medio">
          É aritmética simples: inflação crônica, risco fiscal e um câmbio que corrói décadas de esforço. Quem entende o problema cedo escolhe a saída com calma. É para esse investidor, do zero ao avançado, que a formação foi desenhada.
        </p>
        <div className="atos mt-10 grid gap-4 md:grid-cols-3">
          {DIAGNOSTICO.map(([kick, tt, bd]) => (
            <div key={tt} className="ato group rounded-[12px] border border-areia bg-white p-6 hover:bg-verde">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-gold-dark group-hover:text-gold-lit">{kick}</p>
              <p className="mt-1 font-serif text-[19px] font-semibold text-verde group-hover:text-offwhite">{tt}</p>
              <p className="mt-3 text-[14px] text-medio group-hover:text-muted2">{bd}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Docentes() {
  return (
    <section id="docentes" className="lp-dots grad-verde py-20 text-offwhite md:py-28">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-lit">Corpo docente</p>
        <h2 className="max-w-[24ch] font-serif text-[clamp(26px,4vw,44px)] font-semibold text-balance">
          Quatro nomes que operaram esse mercado por dentro.
        </h2>
        <p className="mt-4 max-w-[64ch] text-muted2">
          Cada módulo é conduzido pelo especialista da área. Nenhum influenciador; gente que sentou nas cadeiras onde essas decisões acontecem.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOCENTES.map((d) => (
            <article key={d.nome} className="prof overflow-hidden rounded-[12px] border border-gold/30 bg-verde-card">
              <div className="ph relative aspect-[4/4.4] overflow-hidden border-b border-gold/35">
                <Image src={d.foto} alt={d.nome} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover object-top" />
              </div>
              <div className="p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gold-lit">{d.chip}</p>
                <p className="mt-2 font-serif text-[18px] font-semibold">{d.nome}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gold-lit/80">{d.cred}</p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted2">{d.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Formacao() {
  return (
    <section id="formacao" className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-[1000px] px-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-dark">A formação</p>
        <h2 className="font-serif text-[clamp(26px,4vw,44px)] font-semibold text-verde text-balance">Do zero à carteira global</h2>
        <p className="mt-4 text-medio">Cada aula listada é o que você vai assistir. Abra os módulos e confira.</p>
        <div className="mt-10 flex flex-col gap-3">
          {MODULOS.map((m, i) => (
            <details key={m.num} className="mod rounded-[12px] border border-areia bg-white px-5 py-4" open={i === 0}>
              <summary className="flex items-center gap-3">
                <span className="font-serif text-[15px] font-semibold text-gold">{m.num}</span>
                <span className="font-serif text-[17px] font-semibold text-verde">{m.titulo}</span>
                <span className="ml-auto flex items-center gap-3">
                  <span className="hidden text-[11px] text-medio sm:inline">{m.docente} · 4 aulas</span>
                  <span className="tgl text-[20px] leading-none text-gold">+</span>
                </span>
              </summary>
              <ul className="mt-4 flex flex-col gap-2 border-t border-bege pt-4">
                {m.aulas.map(([n, t, d]) => (
                  <li key={n} className="flex gap-3">
                    <span className="font-serif text-[13px] font-semibold text-gold-dark">{n}</span>
                    <span>
                      <span className="text-[14px] font-semibold text-grafite">{t}</span>
                      <span className="block text-[12.5px] text-medio">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
        <p className="mt-8 rounded-[10px] bg-gold-soft px-5 py-4 text-[13px] text-gold-dark">
          Incluído em cada módulo: apostila completa e materiais complementares. Bônus: e-book exclusivo. Ao final: prova de certificação (nota mínima 70%) e certificado de 30h, emitido pela BlockTrends com a chancela editorial da VEJA Negócios.
        </p>
      </div>
    </section>
  );
}

function Diferenca() {
  return (
    <section className="bg-bege py-20 md:py-28">
      <div className="mx-auto max-w-[1080px] px-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-dark">A diferença</p>
        <h2 className="max-w-[22ch] font-serif text-[clamp(26px,4vw,44px)] font-semibold text-verde text-balance">
          Dá para tentar sozinho. A pergunta é a que custo.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-[12px] border border-areia bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-erro">✗ Por conta própria</p>
            <ul className="mt-4 flex flex-col gap-3">
              {CONTRA.map((t) => <li key={t} className="text-[14px] text-medio">{t}</li>)}
            </ul>
          </div>
          <div className="rounded-[12px] border-2 border-verde bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-verde">✓ Com a Estratégia Internacional</p>
            <ul className="mt-4 flex flex-col gap-3">
              {A_FAVOR.map((t) => <li key={t} className="text-[14px] text-grafite">{t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuemAssina() {
  return (
    <section id="quem-assina" className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-[1080px] px-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-dark">Quem assina</p>
        <h2 className="font-serif text-[clamp(26px,4vw,44px)] font-semibold text-verde text-balance">Duas instituições, uma responsabilidade.</h2>
        <p className="mt-4 max-w-[68ch] text-medio">
          Uma formação de investimento internacional com o rigor jornalístico e a credibilidade que levaram a VEJA Negócios a assinar junto.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-[14px] border border-gold bg-white p-7">
            <p className="font-serif text-[20px] font-semibold text-verde">VEJA Negócios</p>
            <p className="mt-2 text-[14px] text-medio">Grupo Abril, 70+ anos de jornalismo. Veja, Super Interessante, Você S/A.</p>
          </div>
          <div className="rounded-[14px] border border-areia bg-white p-7">
            <p className="font-serif text-[20px] font-semibold text-verde">Conteúdo por BlockTrends</p>
            <p className="mt-2 text-[14px] text-medio">Edtech de referência em criptoativos, tecnologia e finanças.</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gold-dark">
              <span><b className="font-serif text-[17px] text-verde">31,5 mil</b> estudantes</span>
              <span><b className="font-serif text-[17px] text-verde">+1.000</b> certificados CCA®</span>
              <span><b className="font-serif text-[17px] text-verde">415h+</b> de conteúdo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Oferta() {
  return (
    <section id="oferta" className="lp-dots grad-verde py-20 text-offwhite md:py-28">
      <div className="relative z-10 mx-auto grid max-w-[1080px] items-center gap-10 px-6 md:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-lit">Inscrição</p>
          <h2 className="font-serif text-[clamp(26px,4vw,42px)] font-semibold text-balance">Tudo que você precisa para dolarizar com método.</h2>
          <p className="mt-4 text-muted2">
            Você paga uma vez e estuda por um ano inteiro, no seu ritmo, da primeira aula até o certificado.
          </p>
        </div>
        <div className="vs-glow rounded-[14px] border border-gold/40 bg-verde-card p-7">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gold-lit">Você recebe</p>
          <ul className="mt-4 flex flex-col gap-2">
            {RECEBE.map((t) => (
              <li key={t} className="flex gap-2 text-[14px] text-offwhite"><span className="text-gold-lit">✓</span>{t}</li>
            ))}
          </ul>
          <div className="mt-6 border-t border-gold/20 pt-5">
            <p className="font-serif text-[34px] font-semibold text-gold-lit">{PRECO} <span className="text-[14px] font-normal text-muted2">à vista</span></p>
            <p className="text-[13px] text-muted2">ou {PARCELAS}</p>
          </div>
          <a href={CHECKOUT} className="mt-5 block rounded-[10px] grad-gold px-6 py-4 text-center text-[15px] font-bold text-verde-3">
            → GARANTIR MINHA VAGA
          </a>
          <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
            <span>Compra segura</span><span>7 dias de garantia</span><span>Acesso imediato</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-[820px] px-6">
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-dark">Perguntas frequentes</p>
        <h2 className="font-serif text-[clamp(26px,4vw,44px)] font-semibold text-verde text-balance">O que todo mundo pergunta antes de entrar.</h2>
        <div className="mt-10 flex flex-col gap-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="mod rounded-[12px] border border-areia bg-white px-5 py-4">
              <summary className="flex items-center gap-3">
                <span className="text-[15px] font-semibold text-verde">{q}</span>
                <span className="tgl ml-auto text-[20px] leading-none text-gold">+</span>
              </summary>
              <p className="mt-3 border-t border-bege pt-3 text-[14px] text-medio">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <>
      <section className="lp-dots grad-verde py-20 text-center text-offwhite md:py-24">
        <div className="relative z-10 mx-auto max-w-[820px] px-6">
          <Wordmark className="text-[22px] text-offwhite" />
          <p className="mt-6 font-serif text-[clamp(24px,3.6vw,38px)] font-semibold text-balance">
            Investir no mundo é proteger o que você constrói.
          </p>
          <a href={CHECKOUT} className="mt-8 inline-block rounded-[10px] grad-gold px-7 py-4 text-[15px] font-bold text-verde-3">
            QUERO ME INSCREVER
          </a>
        </div>
      </section>
      <footer className="bg-[#081F16] py-8 text-muted">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-6 text-[11px]">
          <span className="font-bold uppercase tracking-[0.14em]">Estratégia Internacional · BlockTrends × VEJA Negócios</span>
          <span className="flex gap-4">
            <a href="/termos" className="hover:text-gold-lit">Termos de uso</a>
            <a href="/privacidade" className="hover:text-gold-lit">Privacidade · LGPD</a>
            <a href={WHATSAPP} className="hover:text-gold-lit">Suporte no WhatsApp</a>
          </span>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Topbar />
      <Hero />
      <Ficha />
      <Diagnostico />
      <Docentes />
      <Formacao />
      <Diferenca />
      <QuemAssina />
      <Oferta />
      <Faq />
      <CtaFinal />
    </main>
  );
}
