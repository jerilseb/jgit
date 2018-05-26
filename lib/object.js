const fs = require("fs");

const GIT_DIRECTORY = ".jgit";
const OBJECTS_DIRECTORY = `${GIT_DIRECTORY}/objects`;
const INDEX_FILE = `${GIT_DIRECTORY}/index`;

function createObject(sha, contents) {
  let objectDir = `${OBJECTS_DIRECTORY}/${sha.substr(0, 2)}`;
  let objectPath = `${objectDir}/${sha.substr(2)}`;
  if (!fs.existsSync(objectDir)) {
    fs.mkdirSync(objectDir);
  }
  fs.writeFileSync(objectPath, contents);
}

function readIndex() {
  let lines = fs.readFileSync(INDEX_FILE, "utf-8");
  return lines.split("\n").slice(0, -1);
}

function indexFiles() {
  return readIndex().map(entry => {
    let [sha, file] = entry.split(" ");
    return file;
  });
}

module.exports = { createObject, readIndex, indexFiles };
