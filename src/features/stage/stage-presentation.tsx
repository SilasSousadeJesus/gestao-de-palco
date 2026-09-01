"use client";
import { useEffect, useState } from "react";
import type { StageSnapshot } from "./stage-state";
type Props = { snapshot: StageSnapshot | null; block?: { title: string; durationSeconds: number } };
function format(seconds: number) { const absolute = Math.abs(seconds); return `${seconds < 0 ? "-" : ""}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`; }
export function StagePresentation({ snapshot, block }: Props) { const [now, setNow] = useState(0); useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []); if (!snapshot || !block || snapshot.mode === "idle" || now === 0) return <div className="stage-empty">Aguardando inicio do evento</div>; const elapsed = snapshot.mode === "paused" ? snapshot.pausedElapsedSeconds ?? 0 : Math.floor((now - (snapshot.startedAt ?? now)) / 1000); const remaining = block.durationSeconds - elapsed; return <div className={`stage-presentation ${remaining < 0 ? "is-late" : ""}`}><span>{block.title}</span><strong>{format(remaining)}</strong><small>{snapshot.mode === "paused" ? "PAUSADO" : "EM ANDAMENTO"}</small></div>; }
