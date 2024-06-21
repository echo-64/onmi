function prompt (message, callback) {
  const io = { input: process.stdin, output: process.stdout };
  const rl = require("node:readline").createInterface(io);

  rl.question(message, (answare) => {
    rl.close();
    callback(answare);
  });
}

module.exports = prompt;
