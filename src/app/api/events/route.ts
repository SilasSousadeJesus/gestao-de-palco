import { sqlite } from "@/db/client";
import { createEvent, listEvents } from "@/features/events/event-service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export function GET() { return Response.json(listEvents(sqlite)); }
export async function POST(request: Request) {
  try { const body = await request.json() as { title?: unknown; scheduledAt?: unknown; displayMode?: unknown };
    if (typeof body.title !== "string") return Response.json({ error: "Nome invalido." }, { status: 400 });
    const event = createEvent(sqlite, { title: body.title, ...(typeof body.scheduledAt === "number" ? { scheduledAt: body.scheduledAt } : {}), ...(body.displayMode === "messages" ? { displayMode: "messages" } : {}) });
    return Response.json(event, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Falha ao criar evento." }, { status: 400 }); }
}
