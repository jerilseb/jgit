const walk = require("fs-walk");
const fs = require("fs");
const object = require("./lib/object");

function main(params) {
  const index_files = object.indexFiles();
  const changed = [];
  const untracked = [];

  walk.walkSync(".", function(basedir, filename, stat) {
    if (basedir.startsWith(".jgit") || filename == ".jgit") return;
    if (stat.isDirectory()) return;
    if (basedir != ".") filename = basedir + "/" + filename;

    if ((sha = index_files[filename])) {
      let _sha = object.hashObject(fs.readFileSync(filename), false);
      if (sha == _sha) return;
      changed.push(filename);
    } else {
      untracked.push(filename);
    }
  });

  // const new_files = new Set([...files].filter(x => !new Set(index_files).has(x)));
  console.log("Changed files");
  console.log(changed);
  console.log("\nUntracked files");
  console.log(untracked);
}

module.exports = main;
