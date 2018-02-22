const fs = require("fs");

const GIT_DIRECTORY = ".jgit";
const OBJECTS_DIRECTORY = `${GIT_DIRECTORY}/objects`;
const REFS_DIRECTORY = `${GIT_DIRECTORY}/refs`;

function init(param) {
  if (fs.existsSync(GIT_DIRECTORY)) {
    console.log("Existing jgit project");
    return 1;
  }

  fs.mkdirSync(GIT_DIRECTORY);
  buildObjectsDirectory();
  buildRefssDirectory();
  initializeHead();

  console.log(`JGit initialized in ${GIT_DIRECTORY}`);
  return 0;
}

function buildObjectsDirectory() {
  fs.mkdirSync(OBJECTS_DIRECTORY);
  fs.mkdirSync(`${OBJECTS_DIRECTORY}/info`);
  fs.mkdirSync(`${OBJECTS_DIRECTORY}/pack`);
}

function buildRefssDirectory() {
  fs.mkdirSync(REFS_DIRECTORY);
  fs.mkdirSync(`${REFS_DIRECTORY}/heads`);
  fs.mkdirSync(`${REFS_DIRECTORY}/tags`);
}

function initializeHead() {
  fs.writeFileSync(`${GIT_DIRECTORY}/HEAD`, "ref: refs/heads/master");
}

module.exports = init;
