import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextBinary = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const result = spawnSync(process.execPath, [nextBinary, "build"], {
  env: {
    ...process.env,
    NETLIFY_STATIC_EXPORT: "1",
  },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
