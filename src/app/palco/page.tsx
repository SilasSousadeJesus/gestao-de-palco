import { StageScreenClient } from "./stage-screen-client";
export default async function StagePage({ searchParams }: { searchParams: Promise<{ evento?: string }> }) { const { evento } = await searchParams; return <StageScreenClient eventId={evento ?? null} />; }
