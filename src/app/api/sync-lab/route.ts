import { sqlite } from "@/db/client";
import { ensureSyncLabEvent } from "@/features/stage/stage-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function POST() {
  return Response.json(ensureSyncLabEvent(sqlite), {
    headers: { "Cache-Control": "no-store" },
  });
}
