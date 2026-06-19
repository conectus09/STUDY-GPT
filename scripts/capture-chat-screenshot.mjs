import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "../public/chinwag-chat-screenshot.html");
const outputPath = path.resolve(__dirname, "../public/chinwag-chat-screenshot.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
});

await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`);
await page.waitForTimeout(300);

const phone = page.locator("#capture");
await phone.screenshot({ path: outputPath, type: "png" });

await browser.close();
console.log(`Saved screenshot to ${outputPath}`);