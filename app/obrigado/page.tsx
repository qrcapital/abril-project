import { redirect } from "next/navigation";

/** Endereço curto do PRD (`/obrigado`), para o redirect do checkout. A página mora em `/app/obrigado`. */
export default function Obrigado() {
  redirect("/app/obrigado");
}
