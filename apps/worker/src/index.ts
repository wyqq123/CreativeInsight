import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const queues = ["sync-jobs", "ai-label-jobs", "report-jobs"] as const;
const apiBase = process.env.WORKER_API_BASE_URL ?? "http://localhost:4000/api/v1";
const internalToken = process.env.INTERNAL_WORKER_TOKEN ?? "dev-internal-token";

async function reportStatus(
  queue: (typeof queues)[number],
  queueJobId: string,
  payload: { status: string; progress?: number; errorCode?: string; errorMessage?: string; result?: Record<string, unknown> },
) {
  await fetch(`${apiBase}/internal/jobs/${queue}/${queueJobId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Token": internalToken,
      "X-Request-Id": `req_worker_${Date.now()}`,
    },
    body: JSON.stringify(payload),
  });
}

const workers = queues.map(
  (queue) =>
    new Worker(
      queue,
      async (job) => {
        if (!job.id) throw new Error("job id is missing");
        await reportStatus(queue, job.id, { status: "running", progress: 10 });
        console.log(`[worker:${queue}] processing job=${job.name} id=${job.id}`);
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (queue === "sync-jobs") {
          await reportStatus(queue, job.id, { status: "success", progress: 100, result: { syncedCount: 10 } });
          return { syncedCount: 10 };
        }
        if (queue === "ai-label-jobs") {
          await reportStatus(queue, job.id, { status: "awaiting_review", progress: 80 });
          await reportStatus(queue, job.id, { status: "completed", progress: 100, result: { labeledCount: 5 } });
          return { labeledCount: 5 };
        }
        await reportStatus(queue, job.id, {
          status: "ready",
          progress: 100,
          result: { summaryText: "Auto-generated strategy summary", variableFrequency: [] },
        });
        return { reportReady: true };
      },
      { connection },
    ),
);

for (const worker of workers) {
  worker.on("ready", () => {
    console.log(`[worker] ready queue=${worker.name}`);
  });
  worker.on("failed", (job, err) => {
    if (job?.id) {
      void reportStatus(worker.name as (typeof queues)[number], job.id, {
        status: "failed",
        errorCode: "WORKER_FAILED",
        errorMessage: err.message,
      });
    }
    console.error(`[worker] failed queue=${worker.name} job=${job?.id}`, err);
  });
}
