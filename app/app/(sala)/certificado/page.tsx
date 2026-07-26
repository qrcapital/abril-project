import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import CertificadoClient from "./CertificadoClient";

export const metadata: Metadata = { title: "Certificado" };

const html = tela("certificado");

export default function CertificadoPage() {
  return <CertificadoClient html={html} />;
}
