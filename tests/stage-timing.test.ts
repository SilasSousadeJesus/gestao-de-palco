import assert from "node:assert/strict";
import test from "node:test";
import { formatStageTime, remainingSeconds } from "../src/features/stage/stage-timing.ts";
test("calcula tempo positivo, pausado e negativo", () => { assert.equal(remainingSeconds({ durationSeconds: 60, mode: "running", now: 20_000, startedAt: 0, pausedElapsedSeconds: null }), 40); assert.equal(remainingSeconds({ durationSeconds: 60, mode: "paused", now: 20_000, startedAt: 0, pausedElapsedSeconds: 30 }), 30); assert.equal(formatStageTime(-65), "-01:05"); });
