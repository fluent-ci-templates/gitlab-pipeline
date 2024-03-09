import * as jobs from "./jobs.ts";

const { releaseCreate, releaseUpload, runnableJobs } = jobs;

export default async function pipeline(_src = ".", args: string[] = []) {
  if (args.length > 0) {
    await runSpecificJobs(args as jobs.Job[]);
    return;
  }

  await releaseCreate();
  await releaseUpload();
}

async function runSpecificJobs(args: jobs.Job[]) {
  for (const name of args) {
    const job = runnableJobs[name];
    if (!job) {
      throw new Error(`Job ${name} not found`);
    }
    await job();
  }
}
