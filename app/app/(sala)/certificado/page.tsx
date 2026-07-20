import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import CertificadoClient from "./CertificadoClient";

export const metadata: Metadata = { title: "Certificado" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "certificado.html"),
  "utf8"
);

export default function CertificadoPage() {
  return <CertificadoClient html={html} />;
}
