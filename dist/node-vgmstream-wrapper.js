(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:os'), require('node:child_process'), require('node:fs'), require('node:path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:os', 'node:child_process', 'node:fs', 'node:path'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.nodeVgmstreamWrapper = {}, global.os, global.node_child_process, global.fs, global.path));
})(this, (function (exports, os, node_child_process, fs, path) { 'use strict';

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

  async function extract(filePath) {
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

  exports.extract = extract;

}));
