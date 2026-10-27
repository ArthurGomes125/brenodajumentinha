"use client";

import Link from "next/link";
import { useState } from "react";

type StoredAccount = { name: string; email: string; password: string };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    let accounts: StoredAccount[] = [];
    try { accounts = JSON.parse(localStorage.getItem("studyflow-accounts") || "[]"); }
    catch { accounts = []; }
    const cleanEmail = email.trim().toLowerCase();
    const account = accounts.find((item) => item.email === cleanEmail && item.password === password);
    if (!account) {
      setError("E-mail ou senha incorretos. Confira os dados ou crie uma conta.");
      return;
    }
    localStorage.setItem("studyflow-session", JSON.stringify({ name: account.name, email: account.email }));
    window.location.assign("/");
  }

  return <div className="auth-screen">
    <aside className="auth-aside"><strong style={{ fontSize: 24 }}>StudyFlow.</strong><h1>Menos correria. Mais foco no que importa.</h1><p>Seu espaço para planejar tarefas, acompanhar prazos e criar uma rotina de estudos que funciona para você.</p></aside>
    <main className="auth-form-wrap"><form className="auth-form" onSubmit={submit}>
      <h2>Bem-vindo de volta!</h2><p className="subtitulo">Entre na sua conta para continuar.</p>
      <div className="auth-fields">
        <label>E-mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label>
        <label>Senha<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" /></label>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="botao">Entrar</button>
      </div>
      <p className="texto-suave">Ainda não tem conta? <Link className="text-link" href="/cadastro">Criar conta</Link></p>
      <p className="auth-note">Autenticação demonstrativa com dados guardados neste navegador. Não use senhas reutilizadas.</p>
    </form></main>
  </div>;
}
