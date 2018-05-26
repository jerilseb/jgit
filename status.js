const walk = require("fs-walk");
const fs = require("fs");
const { indexFiles } = require("./lib/object");

function main(params) {
  const files = new Set();
  walk.walkSync(".", function(basedir, filename, stat) {
    if (basedir.startsWith(".jgit") || filename == ".jgit") return;
    if (stat.isDirectory()) return;
    files.add(filename);
  });

  const index_files = indexFiles();
  const new_files = new Set([...files].filter(x => !new Set(index_files).has(x)));
  console.log("Staged files");
  console.log(index_files);
  console.log("\nUntracked files");
  console.log(new_files);
}

module.exports = main;
