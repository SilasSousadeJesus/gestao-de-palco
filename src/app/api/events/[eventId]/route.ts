import { sqlite } from "@/db/client";
import { deleteEvent, getEvent, updateEventStatus, updateEventTitle } from "@/features/events/event-service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ eventId: string }> }) { const { eventId } = await context.params; const event = getEvent(sqlite, eventId); return event ? Response.json(event) : Response.json({ error: "Evento nao encontrado." }, { status: 404 }); }
export async function PATCH(request: Request, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params;
  const body = await request.json() as { status?: unknown; title?: unknown };
  if (body.status === undefined && body.title === undefined) return Response.json({ error: "Nada para atualizar." }, { status: 400 });
  if (body.status !== undefined && body.status !== "draft" && body.status !== "active" && body.status !== "closed") return Response.json({ error: "Status invalido." }, { status: 400 });
  if (body.title !== undefined && typeof body.title !== "string") return Response.json({ error: "Nome invalido." }, { status: 400 });
  try {
    let event = null;
    if (body.status !== undefined) event = updateEventStatus(sqlite, eventId, body.status);
    if (body.title !== undefined) event = updateEventTitle(sqlite, eventId, body.title);
    return event ? Response.json(event) : Response.json({ error: "Evento nao encontrado." }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao atualizar evento." }, { status: 400 });
  }
}
export async function DELETE(_request: Request, context: { params: Promise<{ eventId: string }> }) { const { eventId } = await context.params; return deleteEvent(sqlite, eventId) ? new Response(null, { status: 204 }) : Response.json({ error: "Evento nao encontrado." }, { status: 404 }); }
