import type { Metadata } from "next";

import AcoesCertificado from "@/app/_certificado/AcoesCertificado";
import Folha from "@/app/_certificado/Folha";
import { CODIGO_EXEMPLO } from "@/lib/certificado";

export const metadata: Metadata = { title: "Certificado (prévia)" };

const NOME_EXEMPLO = "Marina Tavares de Albuquerque";

/**
 * Prévia do certificado para o admin, sem aluno de verdade.
 *
 * Mora no admin, e não em `/app/certificado?exemplo=1`, porque a guarda já está pronta aqui (o
 * layout de `/admin` devolve 404 para quem não é admin) e porque a rota do aluno EMITE quando não
 * acha certificado: uma prévia ali seria um parâmetro de distância de uma escrita no banco. Esta
 * página não lê nem escreve nada: nome de amostra, data de hoje e o `CODIGO_EXEMPLO`, que tem um `0`
 * fora do alfabeto e por isso nunca coincide com um código emitido. O carimbo "Exemplo" vai na
 * folha, inclusive no PDF e na impressão, para a amostra não circular como certificado.
 *
 * `?nome=` troca o nome de amostra, para conferir como um nome longo assenta na folha.
 */
export default async function PreviaCertificado({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string | string[] }>;
}) {
  const { nome } = await searchParams;
  const escolhido = (Array.isArray(nome) ? nome[0] : nome)?.trim().slice(0, 80) || NOME_EXEMPLO;

  return (
    <div className="cf-pagina" style={{ minHeight: 0, borderRadius: 14 }}>
      <div className="cf-pagina-in">
        <header className="cf-cabeca">
          <p className="cf-sobre">Prévia do admin</p>
          <h1>Certificado de conclusão</h1>
          <p>
            A folha que o aluno recebe ao concluir todas as aulas, com dados de amostra. Para testar outro nome,
            acrescente <code>?nome=</code> ao endereço.
          </p>
        </header>
        <p className="cf-aviso-exemplo">
          Nada aqui é emitido nem gravado. O código {CODIGO_EXEMPLO} não existe no banco, e o carimbo
          &quot;Exemplo&quot; sai também no PDF e na impressão.
        </p>
        <div className="cf-vitrine">
          <Folha nome={escolhido} codigo={CODIGO_EXEMPLO} emitidoEm={new Date().toISOString()} exemplo />
        </div>
        <AcoesCertificado codigo={CODIGO_EXEMPLO} emitidoEm={new Date().toISOString()} exemplo />
      </div>
    </div>
  );
}
