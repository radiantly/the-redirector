/*
 * This is Staticpack, the successor of Webpack Jr.
 * Usage: node staticpack.js entry.js bundle.js
 * Created by @radiantly
 */

const fs = require("fs");
const path = require("path");
const pack = (entry, bundle) => {
  // Read entry file
  const fileContents = fs.readFileSync(entry, "utf-8");

  // Change cwd to match entry file
  process.chdir(path.parse(entry).dir);

  // Build bundle
  fs.writeFileSync(
    bundle,
    fileContents.replace(/`import (.+?)`/g, (_, importpath) => {
      const replacedContents = fs
        .readFileSync(importpath, "utf-8")
        .replace(/`.*?`/g, match => match.replace(/(?<!\\)[`$]/g, "\\$&"));
      return "`" + replacedContents + "`";
    })
  );
};

const args = process.argv.slice(2);
if (args.length !== 2) throw new Error("Incorrect number of arguments");

// Convert relative paths to absolute paths
pack(...args.map(arg => path.resolve(arg)));
