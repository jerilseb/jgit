const fs = require("fs");
const object = require("./lib/object");

const GIT_DIRECTORY = ".jgit";
const INDEX_FILE = `${GIT_DIRECTORY}/index`;

function indexTree() {
  const memo = {};
  for (line of object.readIndex()) {
    let [sha, path] = line.split(" ");
    let segments = path.split("/");

    segments.reduce((_memo, val) => {
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

function getCurrentCommit() {
  const current_branch = fs.readFileSync(`${GIT_DIRECTORY}/HEAD`, "utf-8").split(" ")[1];
  const ref_file = `${GIT_DIRECTORY}/${current_branch}`;
  if (fs.existsSync(ref_file)) {
    return fs.readFileSync(ref_file);
  } else return null;
}

function buildTree(name, tree) {
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
  const sha = object.hashObject(lines.join("\n"));
  return sha;
}

function buildCommit(tree, message) {
  const committer = "user";
  const parent_commit = getCurrentCommit();
  let lines = [`tree ${tree}`, `parent ${parent_commit}`, `author ${committer}`, ``, message];

  const sha = object.hashObject(lines.join("\n"));
  return sha;
}

function updateRef(commit_sha) {
  const current_branch = fs.readFileSync(`${GIT_DIRECTORY}/HEAD`, "utf-8").split(" ")[1];
  fs.writeFileSync(`${GIT_DIRECTORY}/${current_branch}`, commit_sha);
}

function commit(message) {
  if (object.readIndex().length == 0) {
    console.log("Nothing to commit");
    return 1;
  }
  const root_sha = buildTree("root", indexTree());
  const commit_sha = buildCommit(root_sha, message);
  updateRef(commit_sha);
  // fs.truncateSync(INDEX_FILE, 0);
  console.log("committed to master");
  return 0;
}

module.exports = commit;
