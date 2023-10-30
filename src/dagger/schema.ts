import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { releaseUpload } from "./jobs.ts";

const Query = queryType({
  definition(t) {
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

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
