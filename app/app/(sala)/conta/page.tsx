import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import ContaClient from "./ContaClient";

export const metadata: Metadata = { title: "Minha conta" };

const html = tela("conta");

export default function ContaPage() {
  return <ContaClient html={html} />;
}
