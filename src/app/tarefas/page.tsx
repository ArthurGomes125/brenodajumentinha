"use client";

import { useEffect, useState } from "react";

type Task = { id: number; nome: string; materia: string; descricao: string; due: string; prioridade: string; status: string };
type Subject = { id: string | number; nome: string };
const emptyForm = { nome: "", materia: "", descricao: "", due: "", prioridade: "Média", status: "Pendente" };

function readTasks(): Task[] {
  try {
    const tasks = JSON.parse(localStorage.getItem("studyflow-tarefas") || "[]");
    return tasks.map((task: any, index: number) => ({ id: task.id ?? Date.now() + index, nome: task.nome ?? task.titulo ?? "Tarefa", materia: task.materia ?? "", descricao: task.descricao ?? "", due: task.due ?? task.dataEntrega ?? "", prioridade: task.prioridade ?? "Média", status: task.status ?? (task.concluida ? "Concluída" : "Pendente") }));
  } catch { return []; }
}

export default function Tarefas() {
  const [list, setList] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setList(readTasks());
    try {
      const saved = JSON.parse(localStorage.getItem("studyflow-materias") || "[]");
      setSubjects(saved.map((subject: any, index: number) => typeof subject === "string" ? { id: subject, nome: subject } : { id: subject.id ?? index, nome: subject.nome ?? "Matéria" }));
    } catch { setSubjects([]); }
  }, []);

  function save(next: Task[]) { setList(next); localStorage.setItem("studyflow-tarefas", JSON.stringify(next)); }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const task: Task = { ...form, nome: form.nome.trim(), id: editing ?? Date.now() };
    save(editing ? list.map((item) => item.id === editing ? task : item) : [task, ...list]);
    setForm(emptyForm);
    setEditing(null);
  }
  function edit(task: Task) { setEditing(task.id); setForm({ ...task }); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return <>
    <div className="page-heading"><div><h1>✅ Minhas tarefas</h1><p className="subtitulo">Organize atividades, prazos e prioridades.</p></div></div>
    <section className="cartao"><h2 className="section-title">{editing ? "Editar tarefa" : "+ Nova tarefa"}</h2><form className="formulario" onSubmit={submit}>
      <input required placeholder="Nome da tarefa" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} />
      <select value={form.materia} onChange={(event) => setForm({ ...form, materia: event.target.value })}><option value="">Matéria (opcional)</option>{subjects.map((subject) => <option key={subject.id} value={subject.nome}>{subject.nome}</option>)}</select>
      <input aria-label="Data de entrega" type="date" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} />
      <select aria-label="Prioridade" value={form.prioridade} onChange={(event) => setForm({ ...form, prioridade: event.target.value })}>{["Baixa", "Média", "Alta"].map((priority) => <option key={priority}>{priority}</option>)}</select>
      <select aria-label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{["Pendente", "Em andamento", "Concluída"].map((status) => <option key={status}>{status}</option>)}</select>
      <input placeholder="Descrição (opcional)" value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} />
      <button className="botao">{editing ? "Salvar alterações" : "Adicionar tarefa"}</button>{editing && <button type="button" className="botao-secundario" onClick={() => { setEditing(null); setForm(emptyForm); }}>Cancelar</button>}
    </form></section>
    <section className="cartao"><h2 className="section-title">Todas as tarefas · {list.length}</h2>{!list.length && <p className="empty">Nenhuma tarefa por aqui. Crie a primeira acima.</p>}
      {list.map((task) => <div className="item-lista" key={task.id}>
        <div className="item-main"><input aria-label={`Marcar ${task.nome} como concluída`} type="checkbox" checked={task.status === "Concluída" || task.status === "Concluida"} onChange={(event) => save(list.map((item) => item.id === task.id ? { ...item, status: event.target.checked ? "Concluída" : "Pendente" } : item))} /><div><strong style={{ textDecoration: task.status.startsWith("Conclu") ? "line-through" : "none" }}>{task.nome}</strong><small>{task.materia || "Geral"} · {task.due ? new Date(`${task.due}T12:00:00`).toLocaleDateString("pt-BR") : "Sem prazo"} · Prioridade {task.prioridade}</small>{task.descricao && <small>{task.descricao}</small>}</div></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}><span className={`status ${task.status.startsWith("Conclu") ? "done" : ""}`}>{task.status}</span><button className="botao-secundario" onClick={() => edit(task)}>Editar</button><button className="botao-danger" onClick={() => save(list.filter((item) => item.id !== task.id))}>Excluir</button></div>
      </div>)}
    </section>
  </>;
}
