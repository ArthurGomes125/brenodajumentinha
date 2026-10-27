"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../studyflow-shell";

export default function Configuracoes() {
  const { account, logout } = useAuth();
  const [name, setName] = useState("");
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(account?.name || "");
    setDark(localStorage.getItem("studyflow-theme") === "dark");
    setNotifications(localStorage.getItem("studyflow-notifications") === "true");
  }, [account]);

  function save() {
    const cleanName = name.trim();
    if (cleanName.length < 2) return;
    const session = JSON.parse(localStorage.getItem("studyflow-session") || "{}");
    session.name = cleanName;
    localStorage.setItem("studyflow-session", JSON.stringify(session));
    const accounts = JSON.parse(localStorage.getItem("studyflow-accounts") || "[]");
    localStorage.setItem("studyflow-accounts", JSON.stringify(accounts.map((item: any) => item.email === session.email ? { ...item, name: cleanName } : item)));
    localStorage.setItem("studyflow-theme", dark ? "dark" : "light");
    localStorage.setItem("studyflow-notifications", String(notifications));
    document.body.classList.toggle("theme-dark", dark);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return <>
    <div className="page-heading"><div><h1>Configurações</h1><p className="subtitulo">Personalize sua experiência no StudyFlow.</p></div><button className="botao-danger" style={{ padding: "11px 15px", fontSize: 14 }} onClick={logout}>Sair da conta</button></div>
    <section className="cartao"><h2 className="section-title">Perfil</h2><div className="auth-fields" style={{ maxWidth: 500 }}><label>Nome<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} /></label><label>E-mail<input disabled value={account?.email || ""} /></label></div></section>
    <section className="cartao"><h2 className="section-title">Preferências</h2>
      <label className="item-lista"><span><strong>Tema escuro</strong><small>Use uma aparência confortável à noite.</small></span><input type="checkbox" checked={dark} onChange={(event) => setDark(event.target.checked)} /></label>
      <label className="item-lista"><span><strong>Lembretes de estudo</strong><small>Ative sua preferência para receber lembretes.</small></span><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /></label>
      <button className="botao" style={{ marginTop: 17 }} onClick={save}>{saved ? "Alterações salvas!" : "Salvar alterações"}</button>
    </section>
    <section className="cartao"><h2 className="section-title">Seus dados</h2><p className="texto-suave">Seus dados ficam armazenados neste navegador. Limpar os dados do navegador pode removê-los.</p></section>
  </>;
}
