import type { Metadata } from "next";
import { cookies } from "next/headers";
import { tela } from "@/lib/telas";
import HomeClient from "./HomeClient";
import { fillHome } from "@/lib/home-template";
import { parseConcluidas, nomeCookie } from "@/lib/progresso";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";

export const metadata: Metadata = { title: "Início" };

const template = tela("home");

export default async function HomePage() {
  const user = await getUsuario();
  const userId = user?.id ?? "";
  const concluidas = parseConcluidas((await cookies()).get(nomeCookie(userId))?.value);
  return (
    <HomeClient
      html={preencherUsuario(fillHome(template, concluidas), user)}
      userId={userId}
    />
  );
}
