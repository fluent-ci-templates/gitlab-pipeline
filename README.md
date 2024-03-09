# Gitlab Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgitlab_pipeline&query=%24.version)](https://pkg.fluentci.io/gitlab_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://img.shields.io/badge/dagger-v0.10.0-blue?color=3D66FF&labelColor=000000)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/gitlab)](https://jsr.io/@fluentci/gitlab)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gitlab-pipeline)](https://codecov.io/gh/fluent-ci-templates/gitlab-pipeline)
[![ci](https://github.com/fluent-ci-templates/gitlab-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/gitlab-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for uploading assets to gitlab releases.

## 🚀 Usage

Run the following command:

```bash
fluentci run gitlab_pipeline
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/gitlab-pipeline@main
```

Call a function from the module:

```bash
dagger call release-create --src . \
 --token env:GITLAB_ACCESS_TOKEN \
 --tag v0.1.0

dagger call release-upload --src . \
   --token env:GITLAB_ACCESS_TOKEN \
   --tag v0.1.0 \
   --file ./demo_v0.1.0_x86_64-unknown-linux-gnu.tar.gz
```

## 🛠️ Environment Variables

| Variable              | Description                   |
|-----------------------|-------------------------------|
| TAG                   | Git tag to upload to          |
| FILE                  | File to upload                |
| GITLAB_ACCESS_TOKEN   | Gitlab Access Token           |

## ✨ Jobs

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

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { releaseCreate, releaseUpload } from "jsr:@fluentci/gitlab";

await releaseCreate();
await releaseUpload();
```

## 📚 Examples

See [tsiry.sndr/gitlab-release-demo](https://gitlab.com/tsiry.sndr/gitlab-release-demo) for a working example.