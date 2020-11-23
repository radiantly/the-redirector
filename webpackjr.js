/*
 * This is Webpack Jr. He bundles the files in the public folder into a single
 * index.js
 * Usage: node webpackjr.js [--watch] entry.js bundle.js
 * Created by @radiantly
 */

const fs = require("fs");
const path = require("path");

const getRegexes = filename => {
  const extension = filename.split(".").pop();
  const regexes = {
    js: [[/import (?<filename>.*\.html)/, "", ""]],
    html: [
      [/<link.*? href="(?!http)(?<filename>.*\.css)"[\n\s]*\/?>/, "<style>\n", "</style>"],
      [/<script src="(?!http)(?<filename>.*\.js)"><\/script>/, "<script>\n", "</script>"]
    ]
  };
  return regexes[extension] || [];
};

const fsDirs = new Set();

const pack = (filename, top = true) => {
  fileDir = path.dirname(filename);
  fsDirs.add(fileDir);
  let fileContents = fs.readFileSync(filename, "utf-8");
  for (const [regex, prefix, postfix] of getRegexes(filename)) {
    traversed = 0;
    while (true) {
      const match = regex.exec(fileContents.substr(traversed));
      if (!match || !match.groups.filename) break;
      const foundFilename = path.join(fileDir, match.groups.filename);
      console.log(foundFilename);
      let replacedContents = pack(foundFilename, false);
      if (top)
        replacedContents = replacedContents
          .replace(/((?<!\\)[`$])/g, "\\$1")
          .replace(/\{\{([^{}]+?)\}\}/, "${$1}");
      fileContents =
        fileContents.substring(0, match.index) +
        prefix +
        replacedContents +
        postfix +
        fileContents.substr(match.index + match[0].length);
      traversed = match.index + replacedContents.length;
    }
  }
  return fileContents;
};

const args = process.argv.slice(2);
let watch = false;
const watchArgIndex = args.indexOf("--watch");
if (watchArgIndex != -1) {
  watch = true;
  args.splice(watchArgIndex, 1);
}

if (args.length !== 2) throw new Error("Incorrect number of arguments");

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync(args[1], pack(path.resolve(args[0])));
console.log(fsDirs);
if (watch) {
  fsDirs.forEach(fsDir => {
    fs.watch(fsDir, (eventType, filename) => {
      console.log(filename, ": ", eventType);
      fs.writeFileSync(args[1], pack(path.resolve(args[0])));
    });
  });
}
