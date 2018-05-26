const fs = require("fs");
const walk = require("fs-walk");

const GIT_DIRECTORY = ".jgit";
const OBJECTS_DIRECTORY = `${GIT_DIRECTORY}/objects`;
const INDEX_FILE = `${GIT_DIRECTORY}/index`;

function hashObject(contents, write = true) {
  let sha = crypto
    .createHash("sha1")
    .update(contents)
    .digest("hex");
  if (write) {
    let blob = zlib.deflateSync(contents);
    let objectDir = `${OBJECTS_DIRECTORY}/${sha.substr(0, 2)}`;
    let objectPath = `${objectDir}/${sha.substr(2)}`;
    if (!fs.existsSync(objectDir)) {
      fs.mkdirSync(objectDir);
    }
    fs.writeFileSync(objectPath, contents);
  }
  return sha;
}

function findObject(sha_prefix) {
  if (sha_prefix.length < 2) throw "hash prefix must be 2 or more characters";
  const objectDir = `${OBJECTS_DIRECTORY}/${sha_prefix.slice(0, 2)}`;
  const rest = sha_prefix.slice(2);
  const objects = [];
  walk.walkSync(objectDir, function(basedir, filename, stat) {
    if (!stat.isDirectory()) return;
    if (filename.startsWith(rest)) {
      objects.push(filename);
    }
    files.add(filename);
  });

  if (objects.length == 0) throw `No object found with hash ${sha_prefix}`;
  if (objects.length > 1) throw `Multiple objects found with hash ${sha_prefix}`;
  return `${objectDir}/${objects[0]}`;
}

readObject(sha_prefix) {
  const object_path = findObject(sha_prefix);
  const compressed_contents = fs.readFileSync(object_path);
  const contents = zlib.inflateSync(compressed_contents);
  return contents;
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
