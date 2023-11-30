import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
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
export const releaseCreate = async (
  src: string | Directory | undefined = ".",
  token?: string | Secret,
  tag?: string
) => {
  await connect(async (client: Client) => {
    const TAG = Deno.env.get("TAG") || tag || "latest";
    const context = getDirectory(client, src);
    const secret = getGitlabToken(client, token);
    if (!secret) {
      console.error("No Gitlab token found");
      Deno.exit(1);
    }
    const ctr = client
      .pipeline(Job.releaseCreate)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "glab", "git"])
      .withMountedCache("/assets", client.cacheVolume("gl-release-assets"))
      .withDirectory("/app", context)
      .withWorkdir("/app")
      .withSecretVariable("GITLAB_ACCESS_TOKEN", secret)
      .withExec(["bash", "-c", "glab auth login --token $GITLAB_ACCESS_TOKEN"])
      .withExec(["glab", "release", "create", TAG]);

    await ctr.stdout();
  });

  return "Done";
};

/**
 * @function
 * @description Upload asset files to a Gitlab Release
 * @param {string | Directory | undefined} src
 * @param {string | Secret} token
 * @returns {string}
 */
export const releaseUpload = async (
  src: string | Directory | undefined = ".",
  token?: string,
  tag?: string,
  file?: string
) => {
  await connect(async (client: Client) => {
    const TAG = Deno.env.get("TAG") || tag || "latest";
    const FILE = Deno.env.get("FILE") || file!;
    const context = getDirectory(client, src);
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
  [Job.releaseCreate]: releaseCreate,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.releaseUpload]: "Upload asset files to a Gitlab Release",
  [Job.releaseCreate]: "Create a Gitlab Release",
};
