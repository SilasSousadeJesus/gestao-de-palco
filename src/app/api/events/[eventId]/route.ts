import { sqlite } from "@/db/client";
import { getEvent, updateEventStatus } from "@/features/events/event-service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ eventId: string }> }) { const { eventId } = await context.params; const event = getEvent(sqlite, eventId); return event ? Response.json(event) : Response.json({ error: "Evento nao encontrado." }, { status: 404 }); }
export async function PATCH(request: Request, context: { params: Promise<{ eventId: string }> }) { const { eventId } = await context.params; const body = await request.json() as { status?: unknown }; if (body.status !== "draft" && body.status !== "active" && body.status !== "closed") return Response.json({ error: "Status invalido." }, { status: 400 }); const event = updateEventStatus(sqlite, eventId, body.status); return event ? Response.json(event) : Response.json({ error: "Evento nao encontrado." }, { status: 404 }); }
