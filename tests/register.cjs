// Compile source in memory: tests never depend on stale dist files.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require(process.env.VOXL_TYPESCRIPT_PATH || 'typescript');
const sourceRoot = path.resolve(__dirname, '../src') + path.sep;
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('.') && parent?.filename.startsWith(sourceRoot)) {
    const candidate = path.resolve(path.dirname(parent.filename), request.replace(/\.js$/, '.ts'));
    if (candidate.endsWith('.ts') && fs.existsSync(candidate)) return candidate;
  }
  return originalResolve.call(this, request, parent, ...rest);
};
Module._extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  module._compile(result.outputText, filename);
};
