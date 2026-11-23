import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");

// Validate the meme image before copying: it must exist and be a
// plausible PNG size (at least 1 byte, at most 5 MiB). A missing or
// empty/corrupt file would otherwise be copied silently and fail
// grading later with a confusing error.
let size;
try {
  size = statSync(src).size;
} catch {
  throw new Error(`entry.png not found at ${src} — run from the entry repo`);
}
if (size < 1 || size > 5 * 1024 * 1024) {
  throw new Error(
    `entry.png has implausible size ${size} bytes (expected 1 byte–5 MiB) at ${src}`,
  );
}

const out = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "out");
mkdirSync(out, { recursive: true });
copyFileSync(src, join(out, "entry.png"));
console.log(`copied entry.png (${size} bytes) to ${join(out, "entry.png")}`);
