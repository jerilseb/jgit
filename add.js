const fs = require("fs");
const object = require("./lib/object");

const GIT_DIRECTORY = ".jgit";
const OBJECTS_DIRECTORY = `${GIT_DIRECTORY}/objects`;
const INDEX_FILE = `${GIT_DIRECTORY}/index`;

function add(...params) {
  if (!fs.existsSync(GIT_DIRECTORY)) {
    console.log("Not a jgit project");
    return 1;
  }

  if (!params) {
    console.log("No path specified");
    return 1;
  }

  for (const param of params) {
    if (!fs.existsSync(param)) {
      console.log(`${param} doesn't exist`);
      return 1;
    }

    let contents = fs.readFileSync(param);
    const sha = object.hashObject(contents);
    fs.appendFileSync(INDEX_FILE, `${sha} ${param}\n`);
  }

  return 0;
}

module.exports = add;
