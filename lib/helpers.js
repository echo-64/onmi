const { styleText } = require("node:util");

module.exports = {
  style: styleText,
  yn: `[${styleText("green", "y")}/${styleText("red", "n")}]: `,
  warning: (str) => `${styleText("yellow", "\nWarning:")} ${str}`,
  canceled: (str) => `${styleText("red", "\nCanceled:")} ${str}`,
  error: (mark, concat) => {
    console.log(`\n${styleText("red", mark)} ${concat}`);
    process.exit();
  }
};
