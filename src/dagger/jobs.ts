import { Directory, Secret, dag, env, exit } from "../../deps.ts";
import { getDirectory, getGitlabToken } from "./lib.ts";

export enum Job {
  releaseUpload = "release_upload",
  releaseCreate = "release_create",
}

export const exclude = [];

/**
 * Create a Gitlab Release
 *
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
  const TAG = env.get("TAG") || tag || "latest";
  const context = await getDirectory(src);
  const secret = await getGitlabToken(token);
  if (!secret) {
    console.error("No Gitlab token found");
    exit(1);
    return "";
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

  return ctr.stdout();
}

/**
 * Upload asset files to a Gitlab Release
 *
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
  const TAG = env.get("TAG") || tag || "latest";
  const FILE = env.get("FILE") || file!;
  const context = await getDirectory(src);
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
      env.get("GITLAB_ACCESS_TOKEN") || token!,
    ])
    .withExec(["glab", "release", "upload", TAG, FILE]);

  return ctr.stdout();
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
