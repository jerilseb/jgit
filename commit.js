const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");
const object = require("./lib/object");
const { exec } = require("child_process");

const GIT_DIRECTORY = ".jgit";
const INDEX_FILE = `${GIT_DIRECTORY}/index`;
const COMMIT_MESSAGE = `# Title
#
# Body
`;

function indexFiles() {
  let lines = fs.readFileSync(INDEX_FILE, "utf-8");
  return lines.split("\n");
}

function indexTree() {
  let memo = {};
  for (line of indexFiles()) {
    let [sha, path] = line.split(" ");
    let segments = path.split("/");

    var tree = segments.reduce((_memo, val) => {
      if (val == segments[segments.length - 1]) {
        _memo[segments[segments.length - 1]] = sha;
        return _memo;
      } else {
        _memo[val] = _memo[val] || {};
        return _memo[val];
      }
    }, memo);
  }
  return memo;
}

function buildTree(name, tree) {
  const sha = crypto
    .createHash("sha1")
    .update(Date.now() + name)
    .digest("hex");
  let lines = [];
  for (const key of Object.keys(tree)) {
    let value = tree[key];
    if (typeof value == "object") {
      let dir_sha = buildTree(key, value);
      lines.push(`tree ${dir_sha} ${key}`);
    } else {
      lines.push(`blob ${value} ${key}`);
    }
  }
  object.createObject(sha, lines.join("\n"));
  return sha;
}

function buildCommit(tree, message) {
  const commit_message_path = `${GIT_DIRECTORY}/COMMIT_EDITMSG`;
  // exec(`echo "${COMMIT_MESSAGE}" > ${commit_message_path}`);
  // exec(`$EDITOR ${commit_message_path} >/dev/tty`);
  const committer = "user";
  const sha = crypto
    .createHash("sha1")
    .update(Date.now() + committer)
    .digest("hex");
  let lines = [`tree ${tree}`, `author ${committer}`, ``, message];
  object.createObject(sha, lines.join("\n"));
  return sha;
}

function updateRef(commit_sha) {
  const current_branch = fs.readFileSync(`${GIT_DIRECTORY}/HEAD`, "utf-8").split(" ")[1];
  fs.writeFileSync(`${GIT_DIRECTORY}/${current_branch}`, commit_sha);
}

function commit(message) {
  if (indexFiles().length == 0) {
    console.log("Nothing to commit");
    return 1;
  }
  const root_sha = buildTree("root", indexTree());
  const commit_sha = buildCommit(root_sha, message);
  updateRef(commit_sha);
  buildCommit(message);
  fs.truncate(INDEX_FILE, () => {});
  return 0;
}

module.exports = commit;
