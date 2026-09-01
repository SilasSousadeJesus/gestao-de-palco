import { sqlite } from "@/db/client";
import {
  readStageSnapshot,
  StageStateError,
} from "@/features/stage/stage-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;

  try {
    return Response.json(readStageSnapshot(sqlite, eventId), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof StageStateError && error.code === "not_found") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json({ error: "Falha ao obter o estado do palco." }, { status: 500 });
  }
}
