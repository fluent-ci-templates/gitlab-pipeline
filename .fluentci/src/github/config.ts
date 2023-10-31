import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("Tests");

  const push = {
    branches: ["main"],
  };

  const setupDagger = `\
  curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.8.1 sh
  sudo mv bin/dagger /usr/local/bin
  dagger version`;

  const tests: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v3",
      },
      {
        uses: "denoland/setup-deno@v1",
        with: {
          "deno-version": "v1.36",
        },
      },
      {
        name: "Setup Fluent CI CLI",
        run: "deno install -A -r https://cli.fluentci.io -n fluentci",
      },
      {
        name: "Setup Dagger",
        run: setupDagger,
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run . fmt lint test",
      },
      {
        name: "Upload to Codecov",
        run: "fluentci run codecov_pipeline",
        env: {
          CODECOV_TOKEN: "${{ secrets.CODECOV_TOKEN }}",
        },
      },
    ],
  };

  workflow.on({ push }).jobs({ tests });
  return workflow;
}
