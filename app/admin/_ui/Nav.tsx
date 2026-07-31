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
  { href: "/admin/questoes", rotulo: "Questões", pronto: false },
  { href: "/admin/conteudo", rotulo: "Conteúdo", pronto: true },
  { href: "/admin/emails", rotulo: "E-mails", pronto: true },
  // Equipe é escopo novo, pedido pelo Pedro em 30/jul/2026, e não estava no §3 do plano. Fica
  // separada por uma régua porque é a única que fala de quem OPERA, não do que é operado.
  { href: "/admin/equipe", rotulo: "Equipe", pronto: true, separar: true },
];

export default function Nav({ email }: { email?: string }) {
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
    <nav className="flex h-full flex-col bg-verde-3 px-4 py-6 text-offwhite">
      <div className="px-2 pb-7">
        <span className="font-serif text-[17px] text-offwhite">Estratégia Internacional</span>
        <span className="mt-0.5 block text-[11px] tracking-[0.14em] text-gold-lit uppercase">
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
                    ? "bg-verde-card font-semibold text-gold-lit"
                    : "text-muted2 hover:bg-verde-card/60 hover:text-offwhite"
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
