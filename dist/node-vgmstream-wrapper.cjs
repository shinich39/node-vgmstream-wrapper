'use strict';

var os = require('node:os');
var node_child_process = require('node:child_process');
var fs = require('node:fs');
var path = require('node:path');

const CLI_PATHS = {
  linux: "src/vgmstream-win/vgmstream-cli",
  mac: "src/vgmstream-win/vgmstream-cli",
  wasm: "src/vgmstream-win/vgmstream-cli.wasm",
  win: "src/vgmstream-win/vgmstream-cli.exe",
  win64: "src/vgmstream-win64/vgmstream-cli.exe",

  linux: "src/vgmstream-win/vgmstream-cli",
  darwin: "src/vgmstream-win/vgmstream-cli",
  win32: "src/vgmstream-win64/vgmstream-cli.exe",
};

function exec(...args) {
  return new Promise(function (resolve, reject) {
    let stdout = "";
    let stderr = "";

    const child = node_child_process.spawn(args.shift(), args);

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
  if (fs.existsSync("./tmp")) {
    fs.rmSync("./tmp", { recursive: true });
  }
  fs.mkdirSync("./tmp", { recursive: true });

  const cli = CLI_PATHS[os.platform()];
  await exec(
    cli,
    "-S",
    "0",
    "-o",
    "./tmp/?n.wav",
    filePath
  );
  return fs.readdirSync("./tmp").map((item) => {
    return {
      filename: item,
      buffer: fs.readFileSync(path.join("./tmp", item)),
    };
  });
}

exports.decode = decode;
