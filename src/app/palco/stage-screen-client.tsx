"use client";
import { useEffect, useState } from "react";
import { StagePresentation } from "@/features/stage/stage-presentation";
import { useStageSnapshot } from "@/features/stage/use-stage-snapshot";
type EventData = { blocks: { id: string; title: string; durationSeconds: number }[] };
export function StageScreenClient({ eventId }: { eventId: string | null }) { const [event, setEvent] = useState<EventData | null>(null); const { snapshot } = useStageSnapshot(eventId); useEffect(() => { if (!eventId) return; let cancelled = false; void fetch(`/api/events/${eventId}`).then((response) => response.json()).then((data: EventData) => { if (!cancelled) setEvent(data); }); return () => { cancelled = true; }; }, [eventId]); const block = event?.blocks.find((item) => item.id === snapshot?.activeBlockId); return <main className="stage-screen"><StagePresentation block={block} snapshot={snapshot} variant="stage" /></main>; }
