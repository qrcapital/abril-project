"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { emTrabalho } from "@/app/app/_ui/feedback";
import { createClient } from "@/lib/supabase/client";

/**
 * Sidebar do admin (PLANO-ADMIN §3). Cliente por um motivo só: estado ativo precisa do
 * pathname, e layout de servidor não tem acesso a ele.
 *
 * `pronto: false` marca a tela que ainda não existe e a renderiza sem link. A alternativa
 * era listar as cinco como link e entregar quatro 404 — a navegação é a promessa da casca,
 * e promessa quebrada em painel interno vira ticket.
 */
const ITENS = [
  { href: "/admin", rotulo: "Painel", pronto: true },
  { href: "/admin/alunos", rotulo: "Alunos", pronto: true },
  { href: "/admin/conteudo", rotulo: "Conteúdo", pronto: true },
  // Liberação mora ao lado de Conteúdo porque é a outra pergunta sobre a mesma coisa: Conteúdo
  // diz O QUE existe, Liberação diz QUANDO cada módulo abre (migration 0016).
  { href: "/admin/liberacao", rotulo: "Liberação", pronto: true },
  { href: "/admin/emails", rotulo: "E-mails", pronto: true },
  // Prévia da folha do certificado com dados de amostra (out/2026). Só leitura: não emite nada.
  { href: "/admin/certificado", rotulo: "Certificado", pronto: true },
  // Equipe é escopo novo, pedido pelo Pedro em 30/jul/2026, e não estava no §3 do plano. Fica
  // separada por uma régua porque é a única que fala de quem OPERA, não do que é operado.
  { href: "/admin/equipe", rotulo: "Equipe", pronto: true, separar: true },
  // Auditoria fica do lado de Equipe, abaixo da mesma régua, porque é a outra metade do assunto
  // "quem opera": uma diz quem tem a chave, a outra diz o que fizeram com ela.
  { href: "/admin/auditoria", rotulo: "Auditoria", pronto: true },
  // Consentimentos fecha o bloco de rastros: Auditoria responde pelo que a equipe fez, esta
  // responde pelo que os titulares autorizaram. Pedido do jurídico da Abril em set/2026.
  { href: "/admin/consentimentos", rotulo: "Consentimentos", pronto: true },
];

export default function Nav({ email, temAcesso }: { email?: string; temAcesso?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  // `/admin` casa exato; o resto por prefixo, para `/admin/alunos/<id>` manter "Alunos" aceso.
  const ativo = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sair = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    if (btn.getAttribute("aria-busy") === "true") return;
    // Mesmo padrão da área do aluno: `signOut` é ida à rede, e sem sinal o admin clica de
    // novo. Nada é restaurado porque a navegação tira a tela do caminho.
    emTrabalho(btn, "Saindo...");
    createClient()
      .auth.signOut()
      .finally(() => {
        router.push("/app/login");
        router.refresh();
      });
  };

  return (
    <nav className="flex h-full flex-col bg-painel px-4 py-6 text-offwhite">
      {/* O lockup do site, na versão para fundo escuro: marca da VEJA Negócios, filete em pé e o
          nome do curso em duas linhas, como na topbar da LP e da área do aluno. Substituiu em
          29/set/2026 o wordmark empilhado (ESTRATÉGIA em Playfair entre réguas douradas), que era
          da identidade verde e que o site não usa mais em lugar nenhum.

          Um degrau menor que a topbar (marca de 22px): a sidebar tem 232px, e a 26px o nome em
          duas linhas encostava na borda direita. */}
      <div className="px-2 pb-7">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca com altura fixa */}
          <img src="/marca/veja-negocios-escuro.svg" alt="VEJA Negócios" className="block h-[22px] w-auto" />
          <i className="block h-[23px] w-px bg-offwhite/30" aria-hidden />
          <span className="block text-[9.5px] leading-[1.22] tracking-[0.15em] whitespace-nowrap text-offwhite uppercase">
            Estratégia
            <br />
            Internacional
          </span>
        </div>
        <span className="mt-4 block text-[10.5px] font-semibold tracking-[0.1em] text-muted uppercase">
          Administração
        </span>
      </div>

      <ul className="flex flex-col gap-0.5">
        {ITENS.map((item) => (
          <li key={item.href} className={item.separar ? "mt-3 border-t border-white/10 pt-3" : ""}>
            {item.pronto ? (
              <Link
                href={item.href}
                aria-current={ativo(item.href) ? "page" : undefined}
                className={`block rounded-md px-3 py-2 text-[13px] transition-colors ${
                  ativo(item.href)
                    ? "bg-acento font-semibold text-offwhite"
                    : "text-muted2 hover:bg-painel-card/60 hover:text-offwhite"
                }`}
              >
                {item.rotulo}
              </Link>
            ) : (
              <span
                className="flex cursor-default items-center justify-between rounded-md px-3 py-2 text-[13px] text-muted/70"
                title="Tela ainda não construída"
              >
                {item.rotulo}
                <span className="text-[10px] tracking-[0.1em] uppercase">em breve</span>
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* `pb-12` deixa espaço para o badge do devtools do Next, que fica exatamente neste canto
          em dev e cobria o "Sair". Em produção o badge não existe e a folga não incomoda. */}
      <div className="mt-auto border-t border-white/10 pt-4 pb-12">
        {email && (
          <p className="truncate px-3 pb-2 text-[11px] text-muted" title={email}>
            {email}
          </p>
        )}
        {/* A FORMAÇÃO COM A PRÓPRIA CONTA, pedido do Pedro em 31/jul/2026. Não é "ver como o
            aluno X": é o admin entrando no curso como ele mesmo, com a matrícula dele, então a
            esteira semanal e o progresso são os da conta dele.

            Abre em outra aba porque o caminho de volta não existe: o chrome do aluno não tem
            link para o `/admin`, e sem a aba o admin voltaria digitando o endereço. A seta é o
            que avisa isso, e é por ela que este item não se parece com o "Voltar ao site" logo
            abaixo, que troca de tela na mesma aba.

            Sem matrícula ativa vira texto morto, pelo mesmo motivo do `pronto: false` lá em
            cima. */}
        {temAcesso ? (
          <Link
            href="/app"
            target="_blank"
            rel="noopener"
            className="block rounded-md px-3 py-2 text-[12px] text-muted2 hover:text-offwhite"
          >
            Área do aluno ↗
          </Link>
        ) : (
          <span
            className="flex cursor-default items-center justify-between rounded-md px-3 py-2 text-[12px] text-muted/70"
            title="A matrícula desta conta não está ativa, então a área do aluno recusaria a entrada."
          >
            Área do aluno
            {/* "sem acesso" e não "sem matrícula": a condição é `estado !== "ativa"`, que também
                pega matrícula expirada e revogada, onde ela existe. E cabe na sidebar de 232px,
                onde "sem matrícula" quebrava o item em duas linhas. */}
            <span className="text-[10px] tracking-[0.1em] uppercase">sem acesso</span>
          </span>
        )}
        <Link
          href="/"
          className="block rounded-md px-3 py-2 text-[12px] text-muted2 hover:text-offwhite"
        >
          Voltar ao site
        </Link>
        <button
          type="button"
          onClick={sair}
          className="block w-full rounded-md px-3 py-2 text-left text-[12px] text-muted2 hover:text-offwhite"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
