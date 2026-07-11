import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(outDir, { recursive: true });

const WEB = process.env.WEB_URL ?? "http://localhost:3000";
const API = process.env.API_URL ?? "http://localhost:8000";
const seed = process.env.SEED !== "false";

async function seedHistory() {
  const prompts = [
    "Summarize the AMD ROCm platform in one sentence.",
    "What is a good use case for retrieval-augmented generation?",
    "Explain speculative decoding briefly.",
    "Write a haiku about GPUs.",
  ];
  for (const prompt of prompts) {
    try {
      await fetch(`${API}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
    } catch {
      // best-effort; history may be empty if the API is unreachable
    }
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await context.newPage();

if (seed) await seedHistory();

await page.goto(WEB, { waitUntil: "networkidle" });
await page.waitForSelector("text=Execution History", { timeout: 15000 });
await page.waitForTimeout(6000);

await page.screenshot({ path: path.join(outDir, "dashboard.png") });

await page.getByRole("button", { name: "New Execution" }).click();
await page.getByPlaceholder("Ask the model something…").waitFor({ state: "visible", timeout: 5000 });
await page.screenshot({ path: path.join(outDir, "execute.png") });

await page.getByPlaceholder("Ask the model something…").fill("Explain AMD ROCm in one sentence.");
await page.getByRole("button", { name: "Execute" }).click();
await page.waitForTimeout(4000);
await page.screenshot({ path: path.join(outDir, "history.png") });

try {
  const firstView = page.getByRole("button", { name: "View" }).first();
  await firstView.click({ timeout: 8000 });
  await page.getByText("Execution Detail").first().waitFor({ timeout: 8000 });
  await page.waitForTimeout(900);
} catch (err) {
  console.error("detail row click failed:", err instanceof Error ? err.message : err);
}
await page.screenshot({ path: path.join(outDir, "detail.png") });

await browser.close();
console.log(`Screenshots written to ${outDir}`);
