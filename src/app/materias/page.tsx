"use client";

import { useEffect, useState } from "react";

type Subject = { id: string | number; nome: string };
type Task = { materia: string; status: string };

export default function Materias() {
  const [items, setItems] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("studyflow-materias") || "[]");
      setItems(saved.map((item: any, index: number) => typeof item === "string" ? { id: item, nome: item } : { id: item.id ?? index, nome: item.nome ?? "Matéria" }));
      setTasks(JSON.parse(localStorage.getItem("studyflow-tarefas") || "[]"));
    } catch { setItems([]); setTasks([]); }
  }, []);

  function save(next: Subject[]) { setItems(next); localStorage.setItem("studyflow-materias", JSON.stringify(next)); }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    save(editing !== null ? items.map((item) => item.id === editing ? { ...item, nome: cleanName } : item) : [{ id: String(Date.now()), nome: cleanName }, ...items]);
    setName(""); setEditing(null);
  }

  return <>
    <div className="page-heading"><div><h1>📚 Matérias</h1><p className="subtitulo">Suas disciplinas e o progresso de cada uma em um só lugar.</p></div></div>
    <section className="cartao"><h2 className="section-title">{editing !== null ? "Editar matéria" : "+ Adicionar matéria"}</h2><form className="formulario" onSubmit={submit}><input required maxLength={60} placeholder="Ex.: Matemática" value={name} onChange={(event) => setName(event.target.value)} /><button className="botao">{editing !== null ? "Salvar" : "Adicionar matéria"}</button>{editing !== null && <button type="button" className="botao-secundario" onClick={() => { setEditing(null); setName(""); }}>Cancelar</button>}</form></section>
    <div className="subject-grid">{items.map((subject) => {
      const ownTasks = tasks.filter((task) => task.materia === subject.nome);
      const completed = ownTasks.filter((task) => task.status === "Concluída" || task.status === "Concluida").length;
      const percent = ownTasks.length ? Math.round(completed / ownTasks.length * 100) : 0;
      return <article className="subject-card" key={subject.id}><div className="subject-accent" /><h3>{subject.nome}</h3><p>{ownTasks.length} tarefas · {completed} concluídas</p><div className="progress-track" aria-label={`${percent}% concluído`}><div className="progress-fill" style={{ width: `${percent}%` }} /></div><p style={{ marginTop: 8 }}>{percent}% concluído</p><div style={{ display: "flex", gap: 8, marginTop: 16 }}><button className="botao-secundario" onClick={() => { setEditing(subject.id); setName(subject.nome); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Editar</button><button className="botao-danger" onClick={() => save(items.filter((item) => item.id !== subject.id))}>Excluir</button></div></article>;
    })}{!items.length && <section className="cartao"><p className="empty">Cadastre sua primeira matéria para organizar as tarefas por disciplina.</p></section>}</div>
  </>;
}
