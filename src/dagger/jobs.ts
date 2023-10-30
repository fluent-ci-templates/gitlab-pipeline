import Client, { connect } from "../../deps.ts";

export enum Job {
  releaseUpload = "release_upload",
}

export const exclude = [];

export const releaseUpload = async (
  src = ".",
  token?: string,
  tag?: string,
  file?: string
) => {
  await connect(async (client: Client) => {
    const TAG = Deno.env.get("TAG") || tag || "latest";
    const FILE = Deno.env.get("FILE") || file!;
    const context = client.host().directory(src);
    const ctr = client
      .pipeline(Job.releaseUpload)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "glab", "git"])
      .withMountedCache("/assets", client.cacheVolume("gl-release-assets"))
      .withDirectory("/app", context)
      .withWorkdir("/app")
      .withExec([
        "glab",
        "auth",
        "login",
        "--token",
        Deno.env.get("GITLAB_ACCESS_TOKEN") || token!,
      ])
      .withExec(["glab", "release", "upload", TAG, FILE]);

    await ctr.stdout();
  });

  return "Done";
};

export type JobExec = (
  src?: string,
  token?: string,
  tag?: string,
  file?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.releaseUpload]: releaseUpload,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.releaseUpload]: "Upload asset files to a Gitlab Release",
};
