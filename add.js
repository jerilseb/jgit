const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

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
  let blob = zlib.deflate(contents);
  let digest = shaSum.update(contents).digest("hex");
  let objectDir = `${OBJECTS_DIRECTORY}/${digest.substr(0, 2)}`;
  let blobPath = `${objectDir}/${digest.substr(2)}`;
  fs.mkdirSync(objectDir);
  fs.writeFileSync(blobPath, blob);
  fs.appendFileSync(INDEX_FILE, `${digest} ${param}`);

  return 0;
}

module.exports = add;
