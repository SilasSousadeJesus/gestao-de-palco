import { stageEventHub } from "@/features/stage/stage-event-hub";
import type { StageSnapshot } from "@/features/stage/stage-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const encoder = new TextEncoder();

function encodeSnapshot(snapshot: StageSnapshot) {
  return encoder.encode(`event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;
  let unsubscribe: (() => void) | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(": connected\n\n"));
      unsubscribe = stageEventHub.subscribe(eventId, (snapshot) => {
        controller.enqueue(encodeSnapshot(snapshot));
      });
      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"));
      }, 15000);
      request.signal.addEventListener("abort", () => {
        unsubscribe?.();
        if (heartbeat) {
          clearInterval(heartbeat);
        }
        controller.close();
      });
    },
    cancel() {
      unsubscribe?.();
      if (heartbeat) {
        clearInterval(heartbeat);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
