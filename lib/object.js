const fs = require("fs");

const GIT_DIRECTORY = ".jgit";
const OBJECTS_DIRECTORY = `${GIT_DIRECTORY}/objects`;

function createObject(sha, contents) {
  let objectDir = `${OBJECTS_DIRECTORY}/${sha.substr(0, 2)}`;
  let objectPath = `${objectDir}/${sha.substr(2)}`;
  if (!fs.existsSync(objectDir)) {
    fs.mkdirSync(objectDir);
  }
  fs.writeFileSync(objectPath, contents);
}

module.exports = { createObject };
