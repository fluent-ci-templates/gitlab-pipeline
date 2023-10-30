import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import { hello } from "https://pkg.fluentci.io/base_pipeline@v0.4.1/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await hello(client, src);
  });
}

pipeline();
