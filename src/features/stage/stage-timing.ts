export function remainingSeconds(input: { durationSeconds: number; mode: "idle" | "running" | "paused"; now: number; pausedElapsedSeconds: number | null; startedAt: number | null }) {
  const elapsed = input.mode === "paused" ? input.pausedElapsedSeconds ?? 0 : Math.floor((input.now - (input.startedAt ?? input.now)) / 1000);
  return input.durationSeconds - elapsed;
}

export function formatStageTime(seconds: number) {
  const absolute = Math.abs(seconds);
  return `${seconds < 0 ? "-" : ""}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
}
