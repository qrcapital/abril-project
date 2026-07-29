"use client";

import { useEffect, useRef } from "react";

import contato from "@/lib/contato.json";
import { emTrabalho, ligarExigencias, pintarCaixa } from "@/app/app/_ui/feedback";
import { trocarSenha } from "./actions";

const WHATSAPP = contato.whatsapp;

// Estilos do formulário, no tema CLARO da área (o miolo das telas de (sala) é #F7F5F2).
const ROTULO =
  "display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;" +
  "color:#8F887E;font-weight:700;margin-bottom:6px";
const CAMPO =
  "width:100%;box-sizing:border-box;background:#fff;border:1px solid #D6C3C2;border-radius:8px;" +
  "padding:11px 13px;color:#333333;font-family:'Montserrat',sans-serif;font-size:13.5px;" +
  "margin-bottom:14px;outline:none";
const SALVAR =
  "background:#0B2D20;color:#F7F5F2;font-family:'Montserrat',sans-serif;font-weight:700;" +
  "font-size:12.5px;padding:11px 22px;border-radius:8px;border:none;cursor:pointer";

/** Um par rótulo + campo de senha, no estilo da tela. */
function campo(id: string, rotulo: string, autocomplete: AutoFill) {
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = rotulo;
  label.style.cssText = ROTULO;
  const input = document.createElement("input");
  input.id = id;
  input.type = "password";
  input.autocomplete = autocomplete;
  input.style.cssText = CAMPO;
  return { label, input };
}

/**
 * Minha conta (design portado). "Falar no WhatsApp" → canal de suporte.
 *
 * "Trocar senha" era um link morto: o comentário dizia "pendente até o fluxo real" e o fluxo
 * real passou a existir em 28/jul, sem que o link fosse ligado. Botão que não faz nada é o
 * pior feedback que existe, porque a pessoa não sabe se o sistema quebrou ou se ela errou o
 * clique.
 *
 * O formulário é montado no DOM, e não em JSX, pela mesma razão das outras telas: o markup é
 * HTML portado injetado inteiro, e JSX irmão disso vira vizinho do layout, não do cartão.
 */
export default function ContaClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ac = new AbortController();
    const opts = { signal: ac.signal };

    const links = [...root.querySelectorAll<HTMLAnchorElement>("a")];
    for (const a of links) {
      if (/WhatsApp/i.test(a.textContent || "")) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      }
    }

    // A âncora é o link do design. O `usuario-check` garante que ele continua existindo, para
    // uma mudança de porte não devolver o link morto em silêncio.
    const linkSenha = links.find((a) => /Trocar senha/i.test(a.textContent || ""));
    const linha = linkSenha?.closest("div");
    if (!linkSenha || !linha) {
      console.error("[conta] link 'Trocar senha' não encontrado: formulário não montado");
      return;
    }

    // --- formulário, escondido até o clique ---
    const form = document.createElement("form");
    form.hidden = true;
    form.style.cssText = "padding:16px 0 4px;border-top:1px solid #EFE7DB;margin-top:12px";

    const atual = campo("senha-atual", "Senha atual", "current-password");
    const nova = campo("senha-nova", "Senha nova", "new-password");
    const repetir = campo("senha-repetir", "Repita a senha nova", "new-password");
    const exigencias = ligarExigencias(nova.input, "claro");
    const caixa = document.createElement("div");
    caixa.hidden = true;
    caixa.style.marginBottom = "14px";
    const salvar = document.createElement("button");
    salvar.type = "submit";
    salvar.textContent = "Salvar senha";
    salvar.style.cssText = SALVAR;

    form.append(
      atual.label, atual.input,
      nova.label, nova.input,
      exigencias,
      repetir.label, repetir.input,
      caixa, salvar,
    );
    linha.after(form);

    linkSenha.href = "#";
    linkSenha.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        form.hidden = !form.hidden;
        linkSenha.textContent = form.hidden ? "Trocar senha" : "Cancelar";
        if (!form.hidden) atual.input.focus();
      },
      opts,
    );

    form.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();
        if (salvar.disabled) return;
        pintarCaixa(caixa, "erro", null);

        if (nova.input.value !== repetir.input.value) {
          pintarCaixa(caixa, "erro", "As duas senhas não são iguais.", "claro");
          return;
        }

        const restaurar = emTrabalho(salvar, "Salvando...");
        const r = await trocarSenha(atual.input.value, nova.input.value);
        restaurar();

        if (!r.ok) {
          pintarCaixa(caixa, "erro", r.erro, "claro");
          return;
        }
        // Some com os campos: repetir o envio não faz sentido, e a senha nova já vale.
        for (const c of [atual, nova, repetir]) {
          c.label.hidden = true;
          c.input.hidden = true;
        }
        exigencias.hidden = true;
        salvar.hidden = true;
        linkSenha.hidden = true;
        pintarCaixa(caixa, "sucesso", "Senha alterada. Use a nova no próximo acesso.", "claro");
      },
      opts,
    );

    return () => ac.abort();
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
