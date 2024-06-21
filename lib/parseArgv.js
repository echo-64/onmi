const { parseArgs } = require("node:util");

function parseArgv() {
  return parseArgs({
    options: {
      install: {
        type: "string",
        short: "i",
      },

      "save-dev": {
        type: "string",
        short: "D",
      },

      from: {
        type: "string",
        short: "f",
      },

      to: {
        type: "string",
        short: "t",
      },

      help: {
        type: "boolean",
        short: "h",
      },

      version: {
        type: "boolean",
        short: "v",
      },
    },
  }).values;
}

module.exports = parseArgv;
