"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./studyflow-shell";

type Task = { id: number; nome: string; materia: string; due: string; status: string; prioridade: string };
type EventItem = { id: number; nome: string; tipo: string; data: string };
type Subject = { id: string | number; nome: string };

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(`studyflow-${key}`) || JSON.stringify(fallback)) as T;
  } catch {
    return fallback;
  }
}

function normalizeTasks(items: any[]): Task[] {
  return items.map((task, index) => ({
    id: task.id ?? Date.now() + index,
    nome: task.nome ?? task.titulo ?? "Tarefa",
    materia: task.materia ?? "",
    due: task.due ?? task.dataEntrega ?? "",
    status: task.status?.startsWith("Conclu") ? "Concluida" : (task.status ?? (task.concluida ? "Concluida" : "Pendente")),
    prioridade: task.prioridade ?? "Media",
  }));
}

function Stat({ icon, title, value, note }: { icon: string; title: string; value: string | number; note: string }) {
  return <article className="stat-card"><div className="stat-top"><span>{title}</span><span className="stat-icon">{icon}</span></div><div className="numero">{value}</div><div className="stat-note">{note}</div></article>;
}

export default function Dashboard() {
  const { account } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    setTasks(normalizeTasks(read<any[]>("tarefas", [])));
    setEvents(read<EventItem[]>("eventos", []));
    const savedSubjects = read<any[]>("materias", []);
    setSubjects(savedSubjects.map((subject, index) => typeof subject === "string" ? { id: subject, nome: subject } : { id: subject.id ?? index, nome: subject.nome ?? "Matéria" }));
    const storedHours = read<number | string>("horas", read<number | string>("horas-semana", 0));
    setHours(Number(storedHours) || 0);
  }, []);

  const pending = tasks.filter((task) => task.status !== "Concluida");
  const done = tasks.filter((task) => task.status === "Concluida");
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = pending.filter((task) => task.due === today);
  const upcoming = events.filter((event) => event.data >= today).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);
  const upcomingTests = events.filter((event) => event.tipo.toLowerCase() === "prova" && event.data >= today).length;
  const firstName = account?.name?.trim().split(/\s+/)[0] || "estudante";

  return <>
    <header className="topo">
      <div><h1>Olá, {firstName}! 👋</h1><p className="subtitulo">Vamos organizar seus estudos de hoje?</p></div>
      <div className="user-chip">StudyFlow · {account?.name || "Estudante"}</div>
    </header>

    <section className="grade" aria-label="Resumo dos estudos">
      <Stat icon="✓" title="Tarefas pendentes" value={pending.length} note="Prontas para avançar" />
      <Stat icon="★" title="Tarefas concluídas" value={done.length} note="Bom trabalho!" />
      <Stat icon="▣" title="Próximas provas" value={upcomingTests} note="No seu calendário" />
      <Stat icon="◷" title="Horas estudadas" value={`${hours}h`} note="Esta semana" />
    </section>

    <div className="dashboard-grid">
      <section className="cartao">
        <h2 className="section-title">📌 Tarefas de hoje</h2>
        {todayTasks.length === 0 ? <p className="empty">Nenhuma tarefa com entrega para hoje. Aproveite para adiantar algo ou planejar sua semana.</p> : todayTasks.slice(0, 5).map((task) => <div className="item-lista" key={task.id}>
          <div className="item-main"><span className="stat-icon">📚</span><div><strong>{task.materia || "Geral"} — {task.nome}</strong><small>📅 Hoje · Prioridade {task.prioridade}</small></div></div>
          <span className={`status ${task.status === "Em andamento" ? "" : "late"}`}>{task.status}</span>
        </div>)}
        <Link className="text-link" href="/tarefas">Ver todas as tarefas →</Link>
      </section>

      <section className="cartao">
        <h2 className="section-title">📅 Próximos eventos</h2>
        {upcoming.length === 0 ? <p className="empty">Nenhum evento próximo. Adicione uma prova ou trabalho ao calendário.</p> : upcoming.map((event) => <div className="item-lista" key={event.id}>
          <div><strong>{event.nome}</strong><small className="texto-suave">{event.tipo}</small></div>
          <span className="status">{new Date(`${event.data}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>
        </div>)}
        <Link className="text-link" href="/calendario">Abrir calendário →</Link>
      </section>
    </div>

    <section className="cartao">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}><div><h2 className="section-title">📈 Progresso semanal</h2><p className="texto-suave">Continue construindo consistência, um dia de cada vez.</p></div><Link className="text-link" href="/progresso">Ver progresso →</Link></div>
      <div className="chart" aria-label="Gráfico de horas estudadas por dia">{[["Seg", 2], ["Ter", 3], ["Qua", 1.5], ["Qui", 4], ["Sex", 2.5], ["Sáb", 1], ["Dom", 0.5]].map(([day, value]) => <div className="chart-col" key={day}><div className="bar-wrap"><div className="bar" style={{ height: `${Number(value) * 22}px` }} /></div><small>{day}</small></div>)}</div>
    </section>

    <div className="page-heading"><div><h2>📚 Suas matérias</h2><p className="subtitulo">Acompanhe as atividades de cada disciplina.</p></div><Link className="botao" href="/materias">+ Adicionar matéria</Link></div>
    <div className="subject-grid">{subjects.slice(0, 3).map((subject) => {
      const ownTasks = tasks.filter((task) => task.materia === subject.nome);
      const completed = ownTasks.filter((task) => task.status === "Concluida").length;
      return <article className="subject-card" key={subject.id}><div className="subject-accent" /><h3>{subject.nome}</h3><p>{ownTasks.length} tarefas · {completed} concluídas</p><Link className="text-link" href="/materias">Ver matérias →</Link></article>;
    })}{subjects.length === 0 && <p className="empty">Cadastre suas matérias para ver seu resumo aqui. <Link className="text-link" href="/materias">Adicionar matéria →</Link></p>}</div>
  </>;
}
