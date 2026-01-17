const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function executeCodeRaw(language, code, input) {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const id = Date.now();
    let filePath, command;

    switch (language) {
      case "python":
        filePath = path.join(tempDir, `${id}.py`);
        fs.writeFileSync(filePath, code);
        command = `python3 ${filePath}`;
        break;

      case "c":
        filePath = path.join(tempDir, `${id}.c`);
        fs.writeFileSync(filePath, code);
        command = `gcc ${filePath} -o ${tempDir}/${id} && ${tempDir}/${id}`;
        break;

      case "cpp":
        filePath = path.join(tempDir, `${id}.cpp`);
        fs.writeFileSync(filePath, code);
        command = `g++ ${filePath} -o ${tempDir}/${id} && ${tempDir}/${id}`;
        break;

      case "java":
        filePath = path.join(tempDir, `Main${id}.java`);
        fs.writeFileSync(filePath, code);
        command = `javac ${filePath} && java -cp ${tempDir} Main${id}`;
        break;

      default:
        return reject(new Error("Unsupported language"));
    }

    const child = exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) {
        return resolve({
          output: stdout,
          error: stderr || err.message
        });
      }

      resolve({
        output: stdout,
        error: stderr || null
      });
    });

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

module.exports = {
  executeCodeRaw
};
