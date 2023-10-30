import { gql } from "../../deps.ts";

export const releaseUpload = gql`
  query ReleaseUpload(
    $src: String!
    $token: String!
    $tag: String!
    $file: String!
  ) {
    releaseUpload(src: $src, token: $token, tag: $tag, file: $file)
  }
`;
