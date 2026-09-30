import type { Metadata } from "next";
import Link from "next/link";
import { tela } from "@/lib/telas";
import HomeClient from "./HomeClient";
import { fillHome, type Travamento } from "@/lib/home-template";
import { getConcluidas } from "@/lib/progresso";
import { href, rotuloModulo } from "@/lib/curso";
import { lerCertificado } from "@/lib/certificados";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurriculo } from "@/lib/curriculo";
import { getCalendario } from "@/lib/calendario";
import { dataLonga, diasAteData } from "@/lib/liberacao";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import Trilha from "@/app/app/_ui/sala/Trilha";
import { hrefDoModulo } from "@/app/app/_ui/sala/estado";

export const metadata: Metadata = { title: "Início" };

const template = tela("home");

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ travado?: string }>;
}) {
  const [user, curriculo, concluidas] = await Promise.all([
    getUsuario(),
    getCurriculo(),
    getConcluidas(),
  ]);

  // O CARD DO CERTIFICADO lê a TABELA, e não a conta das aulas: é a existência do certificado que
  // decide se o clique leva à tela dele. Quem concluiu antes de a emissão por conclusão existir, ou
  // teve a emissão falhada, cai no "pendente" até a próxima marcação, e a própria tela do
  // certificado emite no resgate (ver o layout de `(certificado)`).
  const certificado = user ? await lerCertificado(createAdminClient(), user.id) : null;

  // Quais módulos ainda não abriram, e quando. O cartão travado mostra a espera em vez de
  // sumir: o aluno precisa ver que o curso continua, e quando. O calendário (`lib/calendario.ts`)
  // já traz a data formatada no fuso de Brasília e o motivo; aqui só se traduz para o card.
  const calendario = await getCalendario();
  const travados = new Map<number, Travamento>();
  for (const m of calendario?.modulos ?? []) {
    if (m.aberto) continue;
    travados.set(
      m.ord,
      m.abreEmTexto
        ? { tipo: "data", texto: m.abreEmTexto }
        : m.motivo === "apos_modulo" && m.dependeDe !== null
          ? { tipo: "apos", rotulo: rotuloModulo(m.dependeDe) }
          : { tipo: "breve" },
    );
  }

  // A explicação do bounce. O índice vem da URL, mas o VEREDITO vem do banco: só vira mensagem
  // se aquele módulo estiver mesmo fechado para este aluno. Assim um `?travado=` digitado à mão
  // não inventa um bloqueio que não existe.
  //
  // A data sai com `dataLonga` (fuso de Brasília). Até 29/set era `toLocaleDateString("pt-BR")`
  // sem fuso, que no servidor da Netlify (UTC) escrevia o dia seguinte para abertura noturna.
  const { travado } = await searchParams;
  const alvo = calendario?.modulos.find((m) => m.ord === Number(travado) && !m.aberto);
  const explicacao = alvo
    ? {
        label: rotuloModulo(alvo.ord),
        dias: alvo.abreEm ? diasAteData(alvo.abreEm) : null,
        data: alvo.abreEm ? dataLonga(alvo.abreEm) : null,
        apos:
          alvo.motivo === "apos_modulo" && alvo.dependeDe !== null && !alvo.abreEm
            ? rotuloModulo(alvo.dependeDe)
            : null,
      }
    : undefined;

  // O miolo novo da home (29/set/2026): o cartão "Comece por aqui" enquanto o Módulo 0 não foi
  // concluído, e a trilha sempre. Entra entre o banner e a prateleira, no marcador do home.html.
  // Não é redesenho da home: o resto continua o markup portado.
  const m0 = calendario?.modulos.find((m) => m.ord === 0);
  const meio = calendario ? (
    <div className="sl sl-embutido">
      <div className="sl-wrap">
        {m0 && !m0.concluido && (
          <section className="sl-chamada sl-escuro" aria-labelledby="chamada-titulo">
            <div className="sl-hero-globo" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element -- arte decorativa em SVG */}
              <img src="/marca/globo-dourado.svg" alt="" />
            </div>
            <div className="sl-chamada-texto">
              <span className="sl-eyebrow">Módulo 0</span>
              <h2 id="chamada-titulo">Comece por aqui</h2>
              <p>
                As aulas de abertura, o jeito de estudar e a data em que cada módulo abre, numa página
                só. {m0.concluidas > 0 ? `Você já fez ${m0.concluidas} de ${m0.aulas}.` : ""}
              </p>
            </div>
            <Link className="sl-btn sl-btn-claro" href="/app/comece">
              Ir para o Comece por aqui
            </Link>
          </section>
        )}
        <section className="sl-home-trilha" aria-labelledby="home-trilha-titulo">
          <div className="sl-home-trilha-cabeca">
            <i aria-hidden="true" />
            <h2 id="home-trilha-titulo">Sua trilha</h2>
          </div>
          <Trilha modulos={calendario.modulos} />
        </section>
      </div>
    </div>
  ) : null;

  return (
    <HomeClient
      meio={meio}
      html={preencherUsuario(
        fillHome(template, curriculo, concluidas, travados, certificado ? "emitido" : "pendente"),
        user,
      )}
      // O cliente deixou de conhecer o currículo: recebe pronto o que precisaria calcular. O card
      // de módulo leva à página do módulo desde 30/set/2026, e não mais à primeira aula dele: é lá
      // que o teatro escolhe a próxima aula não assistida.
      destinos={curriculo.modulos.map((m) => hrefDoModulo(m.idx))}
      destinoAtual={href(curriculo.aulaAtual(concluidas))}
      certificadoEmitido={Boolean(certificado)}
      restantes={curriculo.aulasRestantes(concluidas)}
      totalAulas={curriculo.totalAvaliadas}
      travado={explicacao}
    />
  );
}
