import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { releaseCreate, releaseUpload } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("releaseCreate", {
      args: {
        src: nonNull(stringArg()),
        token: nonNull(stringArg()),
        tag: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await releaseCreate(args.src, args.token, args.tag),
    });
    t.string("releaseUpload", {
      args: {
        src: nonNull(stringArg()),
        token: nonNull(stringArg()),
        tag: nonNull(stringArg()),
        file: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await releaseUpload(args.src, args.token, args.tag, args.file),
    });
  },
});

const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});

schema.description = JSON.stringify({
  "releaseCreate.src": "directory",
  "releaseUpload.src": "directory",
});

export { schema };
