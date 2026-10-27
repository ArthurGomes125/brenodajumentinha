"use client";

import { useEffect, useState } from "react";

type Session = { id: number; materia: string; dia: string; inicio: string; duracao: string };
type Subject = { id: string | number; nome: string };
const days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

export default function Cronograma() {
  const [items, setItems] = useState<Session[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState({ materia: "", dia: "Segunda-feira", inicio: "14:00", duracao: "60" });

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("studyflow-cronograma") || "[]"));
      const savedSubjects = JSON.parse(localStorage.getItem("studyflow-materias") || "[]");
      setSubjects(savedSubjects.map((subject: any, index: number) => typeof subject === "string" ? { id: subject, nome: subject } : { id: subject.id ?? index, nome: subject.nome ?? "Matéria" }));
    } catch { setItems([]); setSubjects([]); }
  }, []);

  function save(next: Session[]) {
    setItems(next);
    localStorage.setItem("studyflow-cronograma", JSON.stringify(next));
  }

  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!form.materia) return;
    save([...items, { ...form, id: Date.now() }]);
  }

  return <>
    <div className="page-heading"><div><h1>⏰ Cronograma de estudos</h1><p className="subtitulo">Monte uma rotina que cabe no seu dia a dia.</p></div></div>
    <section className="cartao"><h2 className="section-title">+ Novo horário de estudo</h2><form className="formulario" onSubmit={add}>
      <select required value={form.materia} onChange={(event) => setForm({ ...form, materia: event.target.value })}><option value="">Escolha uma matéria</option>{subjects.map((subject) => <option key={subject.id} value={subject.nome}>{subject.nome}</option>)}</select>
      <select value={form.dia} onChange={(event) => setForm({ ...form, dia: event.target.value })}>{days.map((day) => <option key={day}>{day}</option>)}</select>
      <input aria-label="Horário de início" type="time" value={form.inicio} onChange={(event) => setForm({ ...form, inicio: event.target.value })} />
      <select aria-label="Duração" value={form.duracao} onChange={(event) => setForm({ ...form, duracao: event.target.value })}>{["30", "45", "60", "90", "120"].map((duration) => <option key={duration} value={duration}>{duration} minutos</option>)}</select>
      <button className="botao">Adicionar horário</button>
    </form>{!subjects.length && <p className="texto-suave">Cadastre matérias antes de criar seus horários.</p>}</section>
    {days.map((day) => {
      const sessions = items.filter((session) => session.dia === day).sort((a, b) => a.inicio.localeCompare(b.inicio));
      return <section className="cartao" key={day}><h2 className="section-title">{day}</h2>{!sessions.length ? <p className="empty">Sem sessões planejadas.</p> : sessions.map((session) => {
        const end = new Date(`2000-01-01T${session.inicio}`);
        end.setMinutes(end.getMinutes() + Number(session.duracao));
        return <div className="item-lista" key={session.id}><div className="item-main"><span className="stat-icon">📚</span><div><strong>{session.materia}</strong><small>{session.inicio}–{end.toTimeString().slice(0, 5)} · {session.duracao} min</small></div></div><button className="botao-danger" onClick={() => save(items.filter((item) => item.id !== session.id))}>Excluir</button></div>;
      })}</section>;
    })}
  </>;
}
