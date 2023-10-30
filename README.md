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

## Environment Variables

| Variable              | Description                   |
|-----------------------|-------------------------------|
| TAG                   | Git tag to upload to          |
| FILE                  | File to upload                |
| GITLAB_ACCESS_TOKEN   | Gitlab Access Token           |


## Jobs

| Job            | Description                                                |
|----------------|------------------------------------------------------------|
| release_upload | Uploads a file to a gitlab release                         |

```graphql
    releaseUpload(
        file: String!, 
        src: String!, 
        tag: String!, 
        token: String!
    ): String
```

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { releaseUpload } from "https://pkg.fluentci.io/gitlab_pipeline@v0.1.0/mod.ts";

await releaseUpload();
```
