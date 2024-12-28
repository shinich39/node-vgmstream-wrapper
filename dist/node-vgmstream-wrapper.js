(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:os'), require('node:child_process'), require('node:fs'), require('node:path'), require('node:url')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:os', 'node:child_process', 'node:fs', 'node:path', 'node:url'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.nodeVgmstreamWrapper = {}, global.os, global.node_child_process, global.fs, global.path, global.node_url));
})(this, (function (exports, os, node_child_process, fs, path, node_url) { 'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  const __dirname = path.dirname(node_url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('node-vgmstream-wrapper.js', document.baseURI).href))));

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

  const CACHE_PATH = path.join(process.cwd(), ".vgmstream");

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

  exports.decode = decode;

}));
