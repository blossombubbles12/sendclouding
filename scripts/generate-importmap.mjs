import { generateImportMap } from "payload";
import { tsImport } from "tsx/esm/api";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const configPath = path.resolve(rootDir, "payload.config.ts");

async function main() {
  const configUrl = pathToFileURL(configPath).href;
  const configModule = await tsImport(configUrl, import.meta.url);
  const config = configModule.default;

  await generateImportMap(config, {
    force: false,
    log: true,
  });

  console.log("\nImport map generated successfully.");
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
