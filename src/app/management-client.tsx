"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";

import { confirmDelete } from "@/lib/confirm-dialog";
import { StagePresentation } from "@/features/stage/stage-presentation";
import { useStageSnapshot } from "@/features/stage/use-stage-snapshot";

type Block = { id: string; title: string; durationSeconds: number; position: number };
type EventItem = { id: string; title: string; status: string; plannedSeconds: number; blocks?: Block[] };

function Icon({ children, filled = false }: { children: ReactNode; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="15"
      height="15"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
const IconEdit = () => <Icon><path d="M13.2 3.6l3.2 3.2L6.6 16.6l-3.6.4.4-3.6L13.2 3.6z" /></Icon>;
const IconTrash = () => (
  <Icon>
    <path d="M4 6h12M8 6V4.6C8 3.7 8.7 3 9.6 3h.8c.9 0 1.6.7 1.6 1.6V6M6.2 6l.7 9.5c.1.9.8 1.5 1.6 1.5h2.9c.8 0 1.5-.6 1.6-1.5L13.8 6" />
  </Icon>
);
const IconPlay = () => <Icon filled><path d="M6.5 4.3v11.4c0 .6.7 1 1.2.7l8.8-5.7c.5-.3.5-1 0-1.4L7.7 3.6c-.5-.3-1.2 0-1.2.7z" /></Icon>;
const IconStop = () => <Icon filled><rect x="5.5" y="5.5" width="9" height="9" rx="1.5" /></Icon>;
const IconCheck = () => <Icon><path d="M4 10.3l3.6 3.7L16 5" /></Icon>;
const IconX = () => <Icon><path d="M5 5l10 10M15 5L5 15" /></Icon>;

const minutes = (seconds: number) => `${Math.floor(seconds / 60)} min`;
const elapsedTime = (seconds: number) =>
  `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function ManagementClient() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [active, setActive] = useState<EventItem | null>(null);
  const [title, setTitle] = useState("");
  const [blockTitle, setBlockTitle] = useState("");
  const [blockMinutes, setBlockMinutes] = useState("30");
  const [messageText, setMessageText] = useState("");
  const [messageLimitHit, setMessageLimitHit] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventTitle, setEditingEventTitle] = useState("");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingBlockTitle, setEditingBlockTitle] = useState("");
  const [editingBlockMinutes, setEditingBlockMinutes] = useState("");
  const { snapshot, connection, setSnapshot } = useStageSnapshot(active?.id ?? null);

  const loadEvents = async () => {
    const items = (await (await fetch("/api/events", { cache: "no-store" })).json()) as EventItem[];
    setEvents(items);
  };

  const openEvent = async (id: string) => {
    const event = (await (await fetch(`/api/events/${id}`)).json()) as EventItem;
    window.localStorage.setItem("gestao-de-palco.evento-ativo", id);
    setActive(event);
  };

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/events", { cache: "no-store" })
      .then((response) => response.json())
      .then((items: EventItem[]) => { if (!cancelled) setEvents(items); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const createEvent = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const created = (await (
      await fetch("/api/events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title }) })
    ).json()) as EventItem;
    window.localStorage.setItem("gestao-de-palco.evento-ativo", created.id);
    setTitle("");
    await loadEvents();
    setActive(created);
  };

  const renameEventStart = (item: EventItem) => { setEditingEventId(item.id); setEditingEventTitle(item.title); };
  const renameEventCancel = () => setEditingEventId(null);
  const renameEventSave = async (id: string) => {
    if (!editingEventTitle.trim()) return;
    const response = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: editingEventTitle.trim() }),
    });
    if (!response.ok) return;
    setEditingEventId(null);
    await loadEvents();
    if (active?.id === id) await openEvent(id);
  };

  const removeEvent = async (item: EventItem) => {
    const confirmed = await confirmDelete({
      title: `Excluir o evento "${item.title}"?`,
      text: "Todos os blocos, timers e mensagens relacionados serao apagados permanentemente.",
    });
    if (!confirmed) return;
    const response = await fetch(`/api/events/${item.id}`, { method: "DELETE" });
    if (!response.ok) return;
    if (active?.id === item.id) {
      setActive(null);
      window.localStorage.removeItem("gestao-de-palco.evento-ativo");
    }
    await loadEvents();
  };

  const addBlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!active) return;
    await fetch(`/api/events/${active.id}/blocks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: blockTitle, durationSeconds: Number(blockMinutes) * 60 }),
    });
    setBlockTitle("");
    await openEvent(active.id);
    await loadEvents();
  };

  const editBlockStart = (block: Block) => {
    setEditingBlockId(block.id);
    setEditingBlockTitle(block.title);
    setEditingBlockMinutes(String(block.durationSeconds / 60));
  };
  const editBlockCancel = () => setEditingBlockId(null);
  const editBlockSave = async (blockId: string) => {
    if (!active) return;
    const durationMinutes = Number(editingBlockMinutes);
    if (!editingBlockTitle.trim() || !Number.isFinite(durationMinutes) || durationMinutes < 1) return;
    const response = await fetch(`/api/events/${active.id}/blocks/${blockId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: editingBlockTitle.trim(), durationSeconds: durationMinutes * 60 }),
    });
    if (!response.ok) return;
    setEditingBlockId(null);
    await openEvent(active.id);
    await loadEvents();
  };

  const removeBlock = async (block: Block) => {
    if (!active) return;
    const confirmed = await confirmDelete({ title: `Excluir o bloco "${block.title}"?` });
    if (!confirmed) return;
    const response = await fetch(`/api/events/${active.id}/blocks/${block.id}`, { method: "DELETE" });
    if (!response.ok) return;
    await openEvent(active.id);
    await loadEvents();
  };

  const command = async (type: "start" | "clear", blockId?: string) => {
    if (!active || !snapshot) return;
    const response = await fetch(`/api/events/${active.id}/stage/commands`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commandId: crypto.randomUUID(), expectedVersion: snapshot.version, type, ...(blockId ? { blockId } : {}) }),
    });
    if (response.ok) setSnapshot(await response.json());
  };

  const sendMessage = async (permanent: boolean) => {
    if (!active || !snapshot || !messageText.trim()) return;
    if (permanent && snapshot.mode !== "idle" && !window.confirm("O timer esta ativo. Colocar a mensagem permanente no palco mesmo assim?")) return;
    const response = await fetch(`/api/events/${active.id}/stage/commands`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        commandId: crypto.randomUUID(),
        expectedVersion: snapshot.version,
        type: "show_message",
        message: messageText.trim(),
        ...(permanent ? {} : { durationSeconds: 20 }),
      }),
    });
    if (response.ok) {
      setSnapshot(await response.json());
      setMessageText("");
      setMessageLimitHit(false);
    }
  };

  const clearMessage = async () => {
    if (!active || !snapshot) return;
    const response = await fetch(`/api/events/${active.id}/stage/commands`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commandId: crypto.randomUUID(), expectedVersion: snapshot.version, type: "clear_message" }),
    });
    if (response.ok) setSnapshot(await response.json());
  };

  const onMessageTextChange = (value: string) => {
    if (value.length > 50) {
      setMessageText(value.slice(0, 50));
      setMessageLimitHit(true);
    } else {
      setMessageText(value);
      setMessageLimitHit(false);
    }
  };

  const currentBlock = active?.blocks?.find((block) => block.id === snapshot?.activeBlockId);
  const elapsed = snapshot
    ? snapshot.eventElapsedSeconds + (snapshot.mode === "running" && snapshot.startedAt ? Math.floor((clock - snapshot.startedAt) / 1000) : 0)
    : 0;

  return (
    <main className="management-shell">
      <header>
        <p className="eyebrow">GESTAO DE PALCO</p>
        <h1>Console do culto</h1>
        <span className="connection">palco: {connection}</span>
      </header>
      <section className="management-grid">
        <aside className="event-panel">
          <h2>Eventos</h2>
          <form onSubmit={createEvent}>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Culto 01 - Domingo" />
            <button>Criar evento</button>
          </form>
          <div className="event-list">
            {events.map((item) =>
              editingEventId === item.id ? (
                <form
                  key={item.id}
                  className="event-edit-form"
                  onSubmit={(event) => { event.preventDefault(); void renameEventSave(item.id); }}
                >
                  <input autoFocus value={editingEventTitle} onChange={(event) => setEditingEventTitle(event.target.value)} />
                  <button type="submit" className="icon-button" title="Salvar" aria-label="Salvar nome"><IconCheck /></button>
                  <button type="button" className="icon-button" title="Cancelar" aria-label="Cancelar edicao" onClick={renameEventCancel}><IconX /></button>
                </form>
              ) : (
                <div className={`event-row ${active?.id === item.id ? "selected" : ""}`} key={item.id}>
                  <button className="event-select" onClick={() => void openEvent(item.id)}>
                    <b>{item.title}</b>
                    <small>{item.status} · {minutes(item.plannedSeconds)}</small>
                  </button>
                  <div className="event-row-actions">
                    <button className="icon-button" title="Editar evento" aria-label="Editar evento" onClick={() => renameEventStart(item)}><IconEdit /></button>
                    <button className="icon-button icon-delete" title="Excluir evento" aria-label="Excluir evento" onClick={() => void removeEvent(item)}><IconTrash /></button>
                  </div>
                </div>
              ),
            )}
          </div>
        </aside>
        <section className="console-panel">
          {active ? (
            <>
              <div className="event-heading">
                <div>
                  <p className="eyebrow">EVENTO ABERTO</p>
                  <h2>{active.title}</h2>
                </div>
                <strong>
                  Total Planejado: {minutes(active.plannedSeconds)}
                  <br />
                  Tempo Decorrido: {elapsedTime(elapsed)}
                </strong>
              </div>
              <form className="block-form" onSubmit={addBlock}>
                <input value={blockTitle} onChange={(event) => setBlockTitle(event.target.value)} placeholder="Nome do bloco" />
                <input min="1" type="number" value={blockMinutes} onChange={(event) => setBlockMinutes(event.target.value)} />
                <button>Adicionar bloco</button>
              </form>
              <div className="blocks">
                {active.blocks?.map((block) => {
                  const isActiveBlock = snapshot?.activeBlockId === block.id && snapshot?.mode !== "idle";
                  return editingBlockId === block.id ? (
                    <form
                      key={block.id}
                      className="block-edit-form"
                      onSubmit={(event) => { event.preventDefault(); void editBlockSave(block.id); }}
                    >
                      <input autoFocus value={editingBlockTitle} onChange={(event) => setEditingBlockTitle(event.target.value)} />
                      <input min="1" type="number" value={editingBlockMinutes} onChange={(event) => setEditingBlockMinutes(event.target.value)} />
                      <button type="submit" className="icon-button" title="Salvar" aria-label="Salvar bloco"><IconCheck /></button>
                      <button type="button" className="icon-button" title="Cancelar" aria-label="Cancelar edicao" onClick={editBlockCancel}><IconX /></button>
                    </form>
                  ) : (
                    <article key={block.id}>
                      <div>
                        <b>{block.title}</b>
                        <small>{minutes(block.durationSeconds)}</small>
                      </div>
                      <div className="block-actions">
                        {isActiveBlock ? (
                          <button className="icon-button" title="Parar" aria-label="Parar bloco" onClick={() => void command("clear")}><IconStop /></button>
                        ) : (
                          <button className="icon-button" title="Iniciar" aria-label="Iniciar bloco" onClick={() => void command("start", block.id)}><IconPlay /></button>
                        )}
                        <button className="icon-button" title="Editar" aria-label="Editar bloco" onClick={() => editBlockStart(block)}><IconEdit /></button>
                        <button className="icon-button icon-delete" title="Excluir" aria-label="Excluir bloco" onClick={() => void removeBlock(block)}><IconTrash /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="live-controls">
                <button onClick={() => void command("clear")}>Limpar palco</button>
              </div>
              <form className="message-form" onSubmit={(event) => { event.preventDefault(); void sendMessage(false); }}>
                <input value={messageText} onChange={(event) => onMessageTextChange(event.target.value)} placeholder="Mensagem para o palco" />
                {messageLimitHit && <small className="message-limit-warning">Limite de 50 caracteres atingido.</small>}
                <div className="message-actions">
                  <button type="submit">Enviar temporaria (20s)</button>
                  <button type="button" onClick={() => void sendMessage(true)}>Enviar permanente</button>
                  <button type="button" onClick={() => void clearMessage()}>Limpar mensagem</button>
                </div>
              </form>
            </>
          ) : (
            <p>Crie ou selecione um evento para iniciar a preparacao.</p>
          )}
        </section>
        <section className="preview-panel">
          <p className="eyebrow">PREVIEW AO VIVO</p>
          <StagePresentation snapshot={snapshot} block={currentBlock} />
          <small>Versao {snapshot?.version ?? "-"} · {connection}</small>
        </section>
      </section>
    </main>
  );
}
