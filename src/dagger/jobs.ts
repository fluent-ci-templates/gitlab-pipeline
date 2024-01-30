import { Directory, Secret, dag } from "../../deps.ts";
import { getDirectory, getGitlabToken } from "./lib.ts";

export enum Job {
  releaseUpload = "release_upload",
  releaseCreate = "release_create",
}

export const exclude = [];

/**
 * @function
 * @description Create a Gitlab Release
 * @param {string | Directory | undefined} src
 * @param {string | Secret} token
 * @returns {string}
 */
export async function releaseCreate(
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  tag?: string
): Promise<string> {
  const TAG = Deno.env.get("TAG") || tag || "latest";
  const context = await getDirectory(dag, src);
  const secret = await getGitlabToken(dag, token);
  if (!secret) {
    console.error("No Gitlab token found");
    Deno.exit(1);
  }
  const ctr = dag
    .pipeline(Job.releaseCreate)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "glab", "git"])
    .withMountedCache("/assets", dag.cacheVolume("gl-release-assets"))
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withSecretVariable("GITLAB_ACCESS_TOKEN", secret)
    .withExec(["bash", "-c", "glab auth login --token $GITLAB_ACCESS_TOKEN"])
    .withExec(["glab", "release", "create", TAG]);

  const result = await ctr.stdout();

  return result;
}

/**
 * @function
 * @description Upload asset files to a Gitlab Release
 * @param {string | Directory | undefined} src
 * @param {string | Secret} token
 * @returns {string}
 */
export async function releaseUpload(
  src: string | Directory | undefined = ".",
  token?: string,
  tag?: string,
  file?: string
): Promise<string> {
  const TAG = Deno.env.get("TAG") || tag || "latest";
  const FILE = Deno.env.get("FILE") || file!;
  const context = await getDirectory(dag, src);
  const ctr = dag
    .pipeline(Job.releaseUpload)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "glab", "git"])
    .withMountedCache("/assets", dag.cacheVolume("gl-release-assets"))
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

  const result = await ctr.stdout();

  return result;
}

export type JobExec = (
  src?: string,
  token?: string,
  tag?: string,
  file?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.releaseUpload]: releaseUpload,
  [Job.releaseCreate]: releaseCreate,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.releaseUpload]: "Upload asset files to a Gitlab Release",
  [Job.releaseCreate]: "Create a Gitlab Release",
};
