import {
  releaseCreate,
  releaseUpload,
} from "https://pkg.fluentci.io/gitlab_pipeline@v0.3.0/mod.ts";

await releaseCreate();
await releaseUpload();
