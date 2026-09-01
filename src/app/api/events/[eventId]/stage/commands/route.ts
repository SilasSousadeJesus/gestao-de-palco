import { sqlite } from "@/db/client";
import { stageEventHub } from "@/features/stage/stage-event-hub";
import {
  applyStageCommand,
  stageCommandTypes,
  StageStateError,
  type StageCommand,
} from "@/features/stage/stage-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseCommand(value: unknown): StageCommand | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const input = value as Record<string, unknown>;
  const commandId = input.commandId;
  const type = input.type;
  const expectedVersion = input.expectedVersion;
  const blockId = input.blockId;

  if (
    typeof commandId !== "string" ||
    commandId.length === 0 ||
    commandId.length > 100 ||
    typeof type !== "string" ||
    !stageCommandTypes.includes(type as StageCommand["type"]) ||
    (blockId !== undefined && (typeof blockId !== "string" || blockId.length === 0)) ||
    (expectedVersion !== undefined &&
      (typeof expectedVersion !== "number" ||
        !Number.isInteger(expectedVersion) ||
        expectedVersion < 0))
  ) {
    return null;
  }

  return {
    commandId,
    type: type as StageCommand["type"],
    ...(blockId === undefined ? {} : { blockId }),
    ...(expectedVersion === undefined ? {} : { expectedVersion }),
  };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "O corpo deve ser JSON valido." }, { status: 400 });
  }

  const command = parseCommand(body);
  if (!command) {
    return Response.json({ error: "Comando de palco invalido." }, { status: 400 });
  }

  const { eventId } = await context.params;

  try {
    const snapshot = applyStageCommand(sqlite, eventId, command);
    stageEventHub.publish(snapshot);
    return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof StageStateError) {
      const status = error.code === "not_found" ? 404 : 409;
      return Response.json({ error: error.message }, { status });
    }

    return Response.json({ error: "Falha ao aplicar o comando de palco." }, { status: 500 });
  }
}
