"use client";

import { useEffect, useState } from "react";

type Task = { materia: string; status: string; concluida?: boolean };
const week = [["Seg", 2], ["Ter", 3], ["Qua", 1.5], ["Qui", 4], ["Sex", 2.5], ["Sáb", 1], ["Dom", 0.5]] as const;

function isCompleted(task: Task) {
  return task.status === "Concluida" || task.status === "Concluída" || task.concluida === true;
}

export default function Progresso() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hours, setHours] = useState("0");

  useEffect(() => {
    try {
      setTasks(JSON.parse(localStorage.getItem("studyflow-tarefas") || "[]"));
      const savedHours = JSON.parse(localStorage.getItem("studyflow-horas") || "0");
      setHours(String(Number(savedHours) || 0));
    } catch {
      setTasks([]);
      setHours("0");
    }
  }, []);

  const completed = tasks.filter(isCompleted).length;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const subjects = Array.from(new Set(tasks.map((task) => task.materia).filter(Boolean)));
  const stats = [
    { title: "Tarefas concluídas", icon: "✓", value: completed + "/" + tasks.length, note: percent + "% do total" },
    { title: "Horas estudadas esta semana", icon: "◷", value: hours + "h", note: "Continue no seu ritmo" },
    { title: "Tarefas em andamento", icon: "↗", value: tasks.filter((task) => task.status === "Em andamento").length, note: "Um passo por vez" },
    { title: "Pendentes", icon: "•", value: tasks.filter((task) => task.status === "Pendente").length, note: "Próximos passos" },
  ];

  return <>
    <div className="page-heading"><div><h1>Meu progresso</h1><p className="subtitulo">Cada pequena sessão conta. Veja sua evolução.</p></div></div>
    <section className="grade" aria-label="Resumo do progresso">
      {stats.map((stat, index) => <article className="stat-card" key={stat.title}>
        <div className="stat-top">{stat.title}<span className="stat-icon">{stat.icon}</span></div>
        <div className="numero">{stat.value}</div>
        {index === 0 ? <><div className="progress-track"><div className="progress-fill" style={{ width: percent + "%" }} /></div><div className="stat-note" style={{ marginTop: 9 }}>{stat.note}</div></> : <div className="stat-note">{stat.note}</div>}
      </article>)}
    </section>

    <section className="cartao">
      <h2 className="section-title">Tarefas concluídas por matéria</h2>
      {!subjects.length && <p className="empty">Adicione tarefas com matérias para acompanhar sua evolução.</p>}
      {subjects.map((subject) => {
        const subjectTasks = tasks.filter((task) => task.materia === subject);
        const subjectCompleted = subjectTasks.filter(isCompleted).length;
        const subjectPercent = subjectTasks.length ? Math.round(subjectCompleted / subjectTasks.length * 100) : 0;
        return <div className="item-lista" key={subject}>
          <strong>{subject}</strong>
          <div className="subject-progress"><div className="progress-track"><div className="progress-fill" style={{ width: subjectPercent + "%" }} /></div><small className="texto-suave">{subjectCompleted}/{subjectTasks.length}</small></div>
        </div>;
      })}
    </section>

    <section className="cartao">
      <h2 className="section-title">Horas de estudo na semana</h2>
      <p className="texto-suave">Exemplo de distribuição semanal. O total de horas considera os dados salvos na sua conta.</p>
      <div className="chart" aria-label="Distribuição semanal de horas de exemplo">
        {week.map(([day, value]) => <div className="chart-col" key={day}><div className="bar-wrap"><div className="bar" style={{ height: value * 22 + "px" }} /></div><small>{day}</small></div>)}
      </div>
    </section>
  </>;
}
