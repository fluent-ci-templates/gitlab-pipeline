# Gitlab Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgitlab_pipeline&query=%24.version)](https://pkg.fluentci.io/gitlab_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gitlab-pipeline)](https://codecov.io/gh/fluent-ci-templates/gitlab-pipeline)

A ready-to-use CI/CD Pipeline for uploading assets to gitlab releases.

## 🚀 Usage

Run the following command:

```bash
fluentci run gitlab_pipeline
```

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger mod install github.com/fluent-ci-templates/gitlab-pipeline@mod
```

## Environment Variables

| Variable              | Description                   |
|-----------------------|-------------------------------|
| TAG                   | Git tag to upload to          |
| FILE                  | File to upload                |
| GITLAB_ACCESS_TOKEN   | Gitlab Access Token           |


## Jobs

| Job            | Description                                                |
|----------------|------------------------------------------------------------|
| release_create | Creates a gitlab release                                   |
| release_upload | Uploads a file to a gitlab release                         |

```typescript
 releaseCreate(
    src: string | Directory | undefined = ".",
    token?: string | Secret,
    tag?: string
 ): Promise<string>

 releaseUpload(
    src: string | Directory | undefined = ".",
    token?: string,
    tag?: string,
    file?: string
 ): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { releaseCreate, releaseUpload } from "https://pkg.fluentci.io/gitlab_pipeline@v0.3.1/mod.ts";

await releaseCreate();
await releaseUpload();
```

## 📚 Examples

See [tsiry.sndr/gitlab-release-demo](https://gitlab.com/tsiry.sndr/gitlab-release-demo) for a working example.