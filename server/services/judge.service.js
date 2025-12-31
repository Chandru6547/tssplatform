const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { normalize } = require("../utils/normalize");
const { log } = require("console");

const TEMP_DIR = path.join(__dirname, "..", "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

/* ---------- RUN DOCKER ---------- */
function runDocker(cmd, input) {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) {
        if (err.killed) {
          reject({ type: "TLE", message: "Time Limit Exceeded" });
        } else {
          reject({ type: "RE", message: stderr || err.message });
        }
      } else {
        resolve(stdout);
      }
    });

    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

/* ---------- MAIN EXECUTOR ---------- */
async function executeCode(language, code, testcases) {
  const jobId = Date.now().toString();
  const jobDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(jobDir);

  let fileName;
  switch (language) {
    case "c": fileName = "main.c"; break;
    case "cpp": fileName = "main.cpp"; break;
    case "python": fileName = "main.py"; break;
    case "java": fileName = "Main.java"; break;
    default: throw new Error("Unsupported language");
  }

  fs.writeFileSync(path.join(jobDir, fileName), code);

  let passed = 0;
  const results = [];

  for (let i = 0; i < testcases.length; i++) {
    const tc = testcases[i];

    const dockerCmd =
      `docker run --rm -i -v "${jobDir}:/workspace" code-runner ${language}`;

    try {
      const actualOutput = await runDocker(dockerCmd, tc.input);

      const normActual = normalize(actualOutput);
      const normExpected = normalize(tc.output);

      const status = normActual === normExpected ? "PASS" : "FAIL";
      if (status === "PASS") passed++;

      results.push({
        input: tc.input,
        expected: tc.output,
        actual: actualOutput,
        status
      });

      // ❌ Stop on first failure
      if (status === "FAIL") break;

    } catch (error) {
      results.push({
        input: tc.input,
        expected: tc.output,
        actual: error.message || "",
        status: error.type || "RE"
      });
      break;
    }
  }

  fs.rmSync(jobDir, { recursive: true, force: true });

  return {
    verdict: passed === testcases.length ? "AC" : "WA",
    passed,
    total: testcases.length,
    results
  };
}


module.exports = { executeCode };
