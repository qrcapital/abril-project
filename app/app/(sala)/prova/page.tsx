import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import ProvaClient from "./ProvaClient";

export const metadata: Metadata = { title: "Prova Final" };

const html = tela("prova");

export default function ProvaPage() {
  return <ProvaClient html={html} />;
}
