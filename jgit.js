const fs = require("fs");
const nodePath = require("path");

[node, jgit, command, ...args] = process.argv;

if (command == undefined) {
  console.log("Usage: jgit <command> [<args>]");
  process.exit(1);
}

const commandFile = `${__dirname}/${command}.js`;

if (!fs.existsSync(commandFile)) {
  console.log("Command not found");
  process.exit(1);
}

let app = require(commandFile);
let code = app(...args);
process.exit(code);
