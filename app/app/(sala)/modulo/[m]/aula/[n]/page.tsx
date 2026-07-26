import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import AulaClient from "./AulaClient";
import { acharAula } from "@/lib/curso";
import { fillAula } from "@/lib/aula-template";
import { parseConcluidas, nomeCookie } from "@/lib/progresso";
import { createClient } from "@/lib/supabase/server";
import { tela } from "@/lib/telas";

export const metadata: Metadata = { title: "Aula" };

const template = tela("aula");

export default async function AulaPage({
  params,
}: {
  params: Promise<{ m: string; n: string }>;
}) {
  const { n } = await params;
  const found = acharAula(Number(n));
  if (!found) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";
  const concluidas = parseConcluidas((await cookies()).get(nomeCookie(userId))?.value);
  return (
    <AulaClient
      html={fillAula(template, found.aula, found.pos, concluidas)}
      userId={userId}
    />
  );
}
