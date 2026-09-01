import { sqlite } from "@/db/client";
import { deleteBlock } from "@/features/events/event-service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function DELETE(_request: Request, context: { params: Promise<{ eventId: string; blockId: string }> }) { const { eventId, blockId } = await context.params; return deleteBlock(sqlite, eventId, blockId) ? new Response(null, { status: 204 }) : Response.json({ error: "Bloco nao encontrado." }, { status: 404 }); }
