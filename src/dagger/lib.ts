import { Directory, DirectoryID, Secret, SecretID } from "../../deps.ts";
import { Client } from "../../sdk/client.gen.ts";

export const getDirectory = async (
  client: Client,
  src: string | Directory | undefined = "."
) => {
  if (typeof src === "string") {
    try {
      const directory = client.loadDirectoryFromID(src as DirectoryID);
      await directory.id();
      return directory;
    } catch (_) {
      return client.host().directory(src);
    }
  }
  return src instanceof Directory ? src : client.host().directory(src);
};

export const getGitlabToken = async (
  client: Client,
  token?: string | Secret
) => {
  if (Deno.env.get("GITLAB_ACCESS_TOKEN")) {
    return client.setSecret(
      "GITLAB_ACCESS_TOKEN",
      Deno.env.get("GITLAB_ACCESS_TOKEN")!
    );
  }
  if (token && typeof token === "string") {
    try {
      const secret = client.loadSecretFromID(token as SecretID);
      await secret.id();
      return secret;
    } catch (_) {
      return client.setSecret("GITLAB_ACCESS_TOKEN", token);
    }
  }
  if (token && token instanceof Secret) {
    return token;
  }
  return undefined;
};
