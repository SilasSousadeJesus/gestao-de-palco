import { StageScreenClient } from "./stage-screen-client";
import { sqlite } from "@/db/client";
import { listEvents } from "@/features/events/event-service";
export default async function StagePage({ searchParams }: { searchParams: Promise<{ evento?: string }> }) { const { evento } = await searchParams; return <StageScreenClient eventId={evento ?? listEvents(sqlite)[0]?.id ?? null} />; }
