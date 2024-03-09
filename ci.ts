import { releaseCreate, releaseUpload } from "jsr:@fluentci/gitlab";

await releaseCreate();
await releaseUpload();
