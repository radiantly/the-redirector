/*
 * This is Staticpack, the successor of Webpack Jr.
 * Usage: node staticpack.js [--watch] entry.js bundle.js
 * Created by @radiantly
 */

const fs = require("fs");
const path = require("path");
const fsDirs = new Set();
const pack = (entry, bundle) => {
  const fileContents = fs.readFileSync(entry, "utf-8");
  fs.writeFileSync(
    bundle,
    fileContents.replace(/`import (.+?)`/g, (match, p1) => {
      const filePath = path.resolve(p1);
      fsDirs.add(path.dirname(filePath));
      const replacedContents = fs
        .readFileSync(p1, "utf-8")
        .replace(/`.*?`/g, match => match.replace(/(?<!\\)[`$]/g, "\\$&"));
      return "`" + replacedContents + "`";
    })
  );
};

const args = process.argv.slice(2);
let watch = false;
const watchArgIndex = args.indexOf("--watch");
if (watchArgIndex != -1) {
  watch = true;
  args.splice(watchArgIndex, 1);
}

if (args.length !== 2) throw new Error("Incorrect number of arguments");

const [entryFilePath, bundleFilePath] = args.map(arg => path.resolve(arg));

if (!fs.existsSync(entryFilePath)) throw new Error(`Cannot find ${entryFilePath}`);
pack(...args);
if (watch) {
  fsDirs.add(path.dirname(entryFilePath));
  fsDirs.forEach(fsDir => {
    fs.watch(fsDir, (eventType, filename) => {
      if (path.resolve(filename) == bundleFilePath) return;
      console.log(filename, ": ", eventType);
      pack(...args);
    });
  });
}
