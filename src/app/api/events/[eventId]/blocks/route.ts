import { sqlite } from "@/db/client";
import { createBlock } from "@/features/events/event-service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request, context: { params: Promise<{ eventId: string }> }) { const { eventId } = await context.params; try { const body = await request.json() as { title?: unknown; durationSeconds?: unknown }; if (typeof body.title !== "string" || typeof body.durationSeconds !== "number") throw new Error("Dados do bloco invalidos."); const block = createBlock(sqlite, eventId, { title: body.title, durationSeconds: body.durationSeconds }); return block ? Response.json(block, { status: 201 }) : Response.json({ error: "Evento nao encontrado." }, { status: 404 }); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Falha." }, { status: 400 }); } }
