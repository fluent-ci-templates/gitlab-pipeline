# Gitlab Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/gitlab_pipeline)](https://pkg.fluentci.io/gitlab_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.42)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
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