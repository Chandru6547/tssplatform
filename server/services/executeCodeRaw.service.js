const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function executeCodeRaw(language, code, input) {
  return new Promise((resolve) => {
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const id = Date.now();
    let filePath, command;

    try {
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
          // ✅ ALWAYS use Main.java
          filePath = path.join(tempDir, `Main.java`);
          fs.writeFileSync(filePath, code);

          // Compile + Run
          command = `javac ${filePath} && java -cp ${tempDir} Main`;
          break;

        default:
          return resolve({
            output: "",
            error: "Unsupported language",
            time: null
          });
      }

      const child = exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
        if (err) {
          return resolve({
            output: stdout || "",
            error: stderr || err.message,
            time: null
          });
        }

        resolve({
          output: stdout || "",
          error: stderr || null,
          time: null
        });
      });

      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      }

    } catch (e) {
      resolve({
        output: "",
        error: e.message,
        time: null
      });
    }
  });
}

module.exports = { executeCodeRaw };
