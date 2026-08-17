import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import HomeClient from "./HomeClient";
import { fillHome, type EstadoCardProva } from "@/lib/home-template";
import { getConcluidas } from "@/lib/progresso";
import { href } from "@/lib/curso";
import { getCurriculo } from "@/lib/curriculo";
import { getMatricula } from "@/lib/matricula";
import { aberturaDoModulo, diasAte, liberacao, REGRA_PADRAO } from "@/lib/liberacao";
import { getRegras } from "@/lib/politicas";
import { getUsuario } from "@/lib/usuario";
import { tentativaAtual } from "@/lib/prova";
import { corrigir } from "@/lib/prova-correcao";
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

  // 2ª CHAMADA LIBERADA E NÃO INICIADA. `attempt > 1` porque a primeira prova de todo mundo também
  // nasceria `available` se um dia a criação mudasse, e um card de "segunda chamada" na home de quem
  // nunca fez a prova seria mentira. O dado vem do banco, nunca da URL.
  const tentativa = user ? await tentativaAtual(user.id) : null;
  const segundaChamada = tentativa?.status === "available" && tentativa.attempt > 1;

  // O ESTADO DO CARD DA PROVA FINAL. A ordem dos testes é a da precedência: quem tem 2ª chamada
  // esperando não é "reprovado" (ele já ganhou a saída), e quem está com a prova aberta não é
  // "liberada". A aprovação sai da correção do snapshot, que é a mesma fonte do porteiro do
  // certificado — usar a coluna `score` aqui abriria duas verdades sobre quem passou.
  const estadoProva: EstadoCardProva = segundaChamada
    ? "segunda"
    : tentativa?.status === "in_progress"
      ? "andamento"
      : tentativa?.status === "submitted"
        ? corrigir(tentativa.questoes, tentativa.respostas).aprovado
          ? "aprovado"
          : "reprovado"
        : curriculo.provaLiberada(concluidas)
          ? "liberada"
          : "bloqueada";

  // Quais módulos ainda não abriram, e em quantos dias. O cartão travado mostra a espera em
  // vez de sumir: o aluno precisa ver que o curso continua, e quando. `null` é módulo em
  // breve (política da migration 0016): fechado sem data, e a copy diz isso.
  const { inicioEm, liberacaoTotal, politicaId } = await getMatricula();
  const regras = await getRegras(politicaId);
  const travados = new Map<number, number | null>();
  if (inicioEm) {
    const { abertos } = liberacao(inicioEm, liberacaoTotal, regras);
    curriculo.modulos.forEach((_, i) => {
      if (!abertos.has(i)) travados.set(i, diasAte(inicioEm, regras[i] ?? REGRA_PADRAO));
    });
  }

  // A explicação do bounce. O índice vem da URL, mas o VEREDITO vem do banco: só vira mensagem
  // se aquele módulo estiver mesmo fechado para este aluno. Assim um `?travado=` digitado à mão
  // não inventa um bloqueio que não existe.
  const { travado } = await searchParams;
  const idx = Number(travado);
  const abreEm = inicioEm
    ? aberturaDoModulo(inicioEm, regras[idx] ?? REGRA_PADRAO)
    : null;
  const explicacao =
    inicioEm && travados.has(idx)
      ? {
          label: curriculo.modulos[idx].label,
          dias: travados.get(idx)!,
          data: abreEm ? abreEm.toLocaleDateString("pt-BR") : null,
        }
      : undefined;

  return (
    <HomeClient
      html={preencherUsuario(
        fillHome(template, curriculo, concluidas, travados, segundaChamada, estadoProva),
        user,
      )}
      // O cliente deixou de conhecer o currículo: recebe pronto o que precisaria calcular.
      destinos={curriculo.modulos.map((m) => href(curriculo.primeiraAulaDoModulo(m.idx)))}
      destinoAtual={href(curriculo.aulaAtual(concluidas))}
      provaLiberada={curriculo.provaLiberada(concluidas)}
      restantes={curriculo.aulasRestantes(concluidas)}
      totalAulas={curriculo.totalAvaliadas}
      travado={explicacao}
    />
  );
}
