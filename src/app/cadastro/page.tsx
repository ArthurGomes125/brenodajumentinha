"use client";

import Link from "next/link";
import { useState } from "react";

type StoredAccount = { name: string; email: string; password: string };

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) return setError("Informe um nome com pelo menos 2 caracteres.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError("Informe um endereço de e-mail válido.");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return setError("A senha precisa ter pelo menos 8 caracteres, uma letra e um número.");
    }

    let accounts: StoredAccount[] = [];
    try { accounts = JSON.parse(localStorage.getItem("studyflow-accounts") || "[]"); }
    catch { accounts = []; }
    if (accounts.some((account) => account.email === cleanEmail)) return setError("Já existe uma conta com esse e-mail.");

    accounts.push({ name: cleanName, email: cleanEmail, password });
    localStorage.setItem("studyflow-accounts", JSON.stringify(accounts));
    localStorage.setItem("studyflow-session", JSON.stringify({ name: cleanName, email: cleanEmail }));
    window.location.assign("/");
  }

  return <div className="auth-screen">
    <aside className="auth-aside"><strong style={{ fontSize: 24 }}>StudyFlow.</strong><h1>Seu próximo passo começa com organização.</h1><p>Reúna tarefas, provas e sessões de estudo em uma rotina mais leve e clara.</p></aside>
    <main className="auth-form-wrap"><form className="auth-form" onSubmit={submit}>
      <h2>Crie sua conta</h2><p className="subtitulo">Comece a organizar seus estudos gratuitamente.</p>
      <div className="auth-fields">
        <label>Nome<input required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></label>
        <label>E-mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label>
        <label>Senha<input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" /></label>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="botao">Criar conta</button>
      </div>
      <p className="texto-suave">Já tem uma conta? <Link className="text-link" href="/login">Entrar</Link></p>
      <p className="auth-note">Conta demonstrativa armazenada neste navegador. Não use uma senha reutilizada em outros serviços.</p>
    </form></main>
  </div>;
}
