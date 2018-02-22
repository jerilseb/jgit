const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");
const { createObject } = require("./lib/object");

const GIT_DIRECTORY = ".jgit";
const OBJECTS_DIRECTORY = `${GIT_DIRECTORY}/objects`;
const INDEX_FILE = `${GIT_DIRECTORY}/index`;
const shaSum = crypto.createHash("sha1");

function add(param) {
  if (!fs.existsSync(GIT_DIRECTORY)) {
    console.log("Not a jgit project");
    return 1;
  }

  if (!param) {
    console.log("No path specified");
    return 1;
  }

  if (!fs.existsSync(param)) {
    console.log(`${param} doesn't exist`);
    return 1;
  }

  let contents = fs.readFileSync(param);
  let digest = shaSum.update(contents).digest("hex");
  let blob = zlib.deflateSync(contents);

  createObject(digest, blob);
  fs.appendFileSync(INDEX_FILE, `${digest} ${param}`);

  return 0;
}

module.exports = add;
