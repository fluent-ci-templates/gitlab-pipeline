import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
} from "../../deps.ts";

import { hello } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("hello", {
      args: {
        src: stringArg(),
      },
      resolve: async (_root, args, _ctx) => await hello(args.src!),
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
