// Opens the admin dev server in a browser that will actually load it.
//
// devServer.port is 6000, which Chrome, Edge and Firefox all refuse by default
// (ERR_UNSAFE_PORT — 6000 is the X11 port). The Nuxt side is already handled by
// patches/get-port-please+3.2.0.patch; this covers the browser side by launching
// with --explicitly-allowed-ports, the only supported way to whitelist it.
//
// Usage: npm run open
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const PORT = 6000;
const URL = `http://localhost:${PORT}/`;

// Chromium-family browsers, most-preferred first. Both accept the same flag.
const CANDIDATES = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env["ProgramFiles(x86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env["ProgramFiles(x86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
  `${process.env.ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
];

const browser = CANDIDATES.find((p) => p && existsSync(p));

if (!browser) {
  console.error(
    `No Chrome or Edge found. Open ${URL} manually in a browser started with:\n` +
      `  --explicitly-allowed-ports=${PORT}\n` +
      `Firefox instead: set network.security.ports.banned.override to ${PORT} in about:config.`
  );
  process.exit(1);
}

console.log(`Opening ${URL} in ${browser.split("\\").pop()} with port ${PORT} allowed…`);

spawn(browser, [`--explicitly-allowed-ports=${PORT}`, URL], {
  detached: true,
  stdio: "ignore",
}).unref();
