import { sqlite } from "@/db/client";
import { deleteBlock, updateBlock } from "@/features/events/event-service";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function DELETE(_request: Request, context: { params: Promise<{ eventId: string; blockId: string }> }) { const { eventId, blockId } = await context.params; return deleteBlock(sqlite, eventId, blockId) ? new Response(null, { status: 204 }) : Response.json({ error: "Bloco nao encontrado." }, { status: 404 }); }
export async function PATCH(request: Request, context: { params: Promise<{ eventId: string; blockId: string }> }) {
  const { eventId, blockId } = await context.params;
  const body = await request.json() as { title?: unknown; durationSeconds?: unknown };
  if (body.title !== undefined && typeof body.title !== "string") return Response.json({ error: "Nome invalido." }, { status: 400 });
  if (body.durationSeconds !== undefined && typeof body.durationSeconds !== "number") return Response.json({ error: "Duracao invalida." }, { status: 400 });
  try {
    const block = updateBlock(sqlite, eventId, blockId, {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.durationSeconds !== undefined ? { durationSeconds: body.durationSeconds } : {}),
    });
    return block ? Response.json(block) : Response.json({ error: "Bloco nao encontrado." }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao atualizar bloco." }, { status: 400 });
  }
}
