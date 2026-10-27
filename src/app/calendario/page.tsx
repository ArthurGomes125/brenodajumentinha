"use client";

import { useEffect, useMemo, useState } from "react";

type EventItem = { id: number; nome: string; tipo: string; data: string };
const eventTypes = ["Prova", "Trabalho", "Atividade", "Sessão de estudo"];

export default function Calendario() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState(eventTypes[0]);
  const [date, setDate] = useState("");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("studyflow-eventos") || "[]")); }
    catch { setItems([]); }
  }, []);

  function save(next: EventItem[]) {
    setItems(next);
    localStorage.setItem("studyflow-eventos", JSON.stringify(next));
  }

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName || !date) {
      setError("Informe o nome e a data do evento.");
      return;
    }
    const newEvent = { id: Date.now(), nome: cleanName, tipo: type, data: date };
    save([newEvent, ...items]);
    setSelectedDate(date);
    setName("");
    setDate("");
    setError("");
  }

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const today = new Date();
  const todayKey = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  const getDateKey = (day: number) => String(year) + "-" + String(monthIndex + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  const selectedEvents = useMemo(() => items.filter((item) => item.data === selectedDate), [items, selectedDate]);
  const orderedEvents = [...items].sort((a, b) => a.data.localeCompare(b.data));

  return <>
    <div className="page-heading"><div><h1>Calendário</h1><p className="subtitulo">Provas, trabalhos e compromissos escolares.</p></div></div>
    <section className="cartao">
      <h2 className="section-title">+ Adicionar evento</h2>
      <form className="formulario" onSubmit={add}>
        <input required maxLength={100} placeholder="Nome do evento" value={name} onChange={(event) => setName(event.target.value)} />
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Tipo de evento">{eventTypes.map((eventType) => <option key={eventType}>{eventType}</option>)}</select>
        <input required type="date" aria-label="Data do evento" value={date} onChange={(event) => setDate(event.target.value)} />
        <button className="botao">Adicionar evento</button>
      </form>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </section>

    <section className="cartao">
      <div className="calendar-head">
        <button type="button" className="botao-secundario" aria-label="Mês anterior" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}>‹</button>
        <h2 className="section-title" style={{ margin: 0 }}>{month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h2>
        <button type="button" className="botao-secundario" aria-label="Próximo mês" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}>›</button>
      </div>
      <div className="calendar-grid">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((weekday) => <strong className="calendar-weekday" key={weekday}>{weekday}</strong>)}
        {Array.from({ length: firstWeekday }, (_, index) => <div aria-hidden="true" key={"empty-" + index} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const key = getDateKey(day);
          const dayEvents = items.filter((item) => item.data === key);
          const classes = "calendar-day" + (key === todayKey ? " today" : "") + (key === selectedDate ? " selected" : "");
          return <button type="button" key={key} className={classes} onClick={() => setSelectedDate(key)} aria-label={String(day) + " de " + month.toLocaleDateString("pt-BR", { month: "long" }) + ", " + dayEvents.length + " eventos"}>
            <strong>{day}</strong>
            {dayEvents.slice(0, 2).map((item) => <small key={item.id} title={item.tipo + ": " + item.nome}>{item.nome}</small>)}
            {dayEvents.length > 2 && <small>+{dayEvents.length - 2} mais</small>}
          </button>;
        })}
      </div>
      <div className="selected-day-events"><h3 className="section-title">{selectedDate ? "Eventos em " + new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR") : "Selecione um dia"}</h3>
        {selectedEvents.length ? selectedEvents.map((item) => <div className="item-lista" key={item.id}><div><strong>{item.nome}</strong><small>{item.tipo}</small></div><button className="botao-danger" onClick={() => save(items.filter((entry) => entry.id !== item.id))}>Excluir</button></div>) : <p className="empty">Nenhum evento nesta data.</p>}
      </div>
    </section>

    <section className="cartao"><h2 className="section-title">Todos os eventos · {items.length}</h2>
      {!items.length && <p className="empty">Seus eventos aparecerão aqui.</p>}
      {orderedEvents.map((item) => <div className="item-lista" key={item.id}><div><strong>{item.nome}</strong><small>{item.tipo} · {new Date(item.data + "T12:00:00").toLocaleDateString("pt-BR")}</small></div><button className="botao-danger" onClick={() => save(items.filter((entry) => entry.id !== item.id))}>Excluir</button></div>)}
    </section>
  </>;
}
