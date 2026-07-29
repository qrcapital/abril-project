import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import HomeClient from "./HomeClient";
import { fillHome } from "@/lib/home-template";
import { getConcluidas } from "@/lib/progresso";
import { href } from "@/lib/curso";
import { getCurriculo } from "@/lib/curriculo";
import { getMatricula } from "@/lib/matricula";
import { aberturaDoModulo, diasAte, liberacao } from "@/lib/liberacao";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";

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

  // Quais módulos ainda não abriram, e em quantos dias. O cartão travado mostra a espera em
  // vez de sumir: o aluno precisa ver que o curso continua, e quando.
  const { inicioEm, liberacaoTotal } = await getMatricula();
  const travados = new Map<number, number>();
  if (inicioEm) {
    const { abertos } = liberacao(inicioEm, liberacaoTotal, curriculo.modulos.length);
    curriculo.modulos.forEach((_, i) => {
      if (!abertos.has(i)) travados.set(i, diasAte(inicioEm, i));
    });
  }

  // A explicação do bounce. O índice vem da URL, mas o VEREDITO vem do banco: só vira mensagem
  // se aquele módulo estiver mesmo fechado para este aluno. Assim um `?travado=` digitado à mão
  // não inventa um bloqueio que não existe.
  const { travado } = await searchParams;
  const idx = Number(travado);
  const explicacao =
    inicioEm && travados.has(idx)
      ? {
          label: curriculo.modulos[idx].label,
          dias: travados.get(idx)!,
          data: aberturaDoModulo(inicioEm, idx).toLocaleDateString("pt-BR"),
        }
      : undefined;

  return (
    <HomeClient
      html={preencherUsuario(fillHome(template, curriculo, concluidas, travados), user)}
      // O cliente deixou de conhecer o currículo: recebe pronto o que precisaria calcular.
      destinos={curriculo.modulos.map((m) => href(curriculo.primeiraAulaDoModulo(m.idx)))}
      destinoAtual={href(curriculo.aulaAtual(concluidas))}
      provaLiberada={curriculo.provaLiberada(concluidas)}
      restantes={curriculo.aulasRestantes(concluidas)}
      travado={explicacao}
    />
  );
}
