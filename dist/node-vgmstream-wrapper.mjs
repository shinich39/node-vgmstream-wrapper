import os from 'node:os';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLI_PATHS = {
  linux: path.join(__dirname, "../src/vgmstream-linux-cli/vgmstream-cli"),
  mac: path.join(__dirname, "../src/vgmstream-mac-cli/vgmstream-cli"),
  wasm: path.join(__dirname, "../src/vgmstream-wasm/vgmstream-cli.wasm"),
  win: path.join(__dirname, "../src/vgmstream-win/vgmstream-cli.exe"),
  win64: path.join(__dirname, "../src/vgmstream-win64/vgmstream-cli.exe"),

  linux: path.join(__dirname, "../src/vgmstream-linux-cli/vgmstream-cli"),
  darwin: path.join(__dirname, "../src/vgmstream-mac-cli/vgmstream-cli"),
  win32: path.join(__dirname, "../src/vgmstream-win64/vgmstream-cli.exe"),
};

const CACHE_PATH = path.join(__dirname, "../.vgmstream");

function exec(...args) {
  return new Promise(function (resolve, reject) {
    let stdout = "";
    let stderr = "";

    const child = spawn(args.shift(), args);

    child.stdout.on("data", function (data) {
      stdout += data.toString();
    });

    child.stderr.on("data", function (data) {
      stderr += data.toString();
    });

    child.on("error", function (err) {
      reject(err);
    });

    child.on("exit", function (code, signal) {
      resolve({ stdout, stderr });
    });
  });
}

async function decode(filePath) {
  if (fs.existsSync(CACHE_PATH)) {
    fs.rmSync(CACHE_PATH, { recursive: true });
  }
  fs.mkdirSync(CACHE_PATH, { recursive: true });

  const cli = CLI_PATHS[os.platform()];
  await exec(
    cli,
    "-S",
    "0",
    "-o",
    path.join(CACHE_PATH, "?n.wav"),
    path.resolve(filePath)
  );
  return fs.readdirSync(CACHE_PATH).map((item) => {
    return {
      filename: item,
      buffer: fs.readFileSync(path.join(CACHE_PATH, item)),
    };
  });
}

export { decode };
