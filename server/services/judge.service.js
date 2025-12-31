const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { normalize } = require("../utils/normalize");

/* ---------------- TEMP DIR ---------------- */
const TEMP_DIR = path.join(process.cwd(), "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

/* ---------------- RUN COMMAND ---------------- */
function runCommand(command, input, cwd) {
  return new Promise((resolve, reject) => {
    const child = exec(
      command,
      {
        cwd,
        timeout: 3000,                 // ⏱️ TLE protection
        maxBuffer: 1024 * 1024         // 💾 output limit
      },
      (err, stdout, stderr) => {
        if (err) {
          if (err.killed) {
            reject({ type: "TLE", message: "Time Limit Exceeded" });
          } else {
            reject({ type: "RE", message: stderr || err.message });
          }
        } else {
          resolve(stdout);
        }
      }
    );

    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

/* ---------------- MAIN EXECUTOR ---------------- */
async function executeCode(language, code, testcases) {
  const jobId = Date.now().toString();
  const jobDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(jobDir);

  let fileName, compileCmd, runCmd;

  switch (language) {
    case "c":
      fileName = "main.c";
      compileCmd = "gcc main.c -o main";
      runCmd = "./main";
      break;

    case "cpp":
      fileName = "main.cpp";
      compileCmd = "g++ main.cpp -o main";
      runCmd = "./main";
      break;

    case "python":
      fileName = "main.py";
      compileCmd = null;
      runCmd = "python3 main.py";
      break;

    case "java":
      fileName = "Main.java";
      compileCmd = "javac Main.java";
      runCmd = "java Main";
      break;

    default:
      throw new Error("Unsupported language");
  }

  /* ---------- WRITE CODE FILE ---------- */
  fs.writeFileSync(path.join(jobDir, fileName), code);

  /* ---------- COMPILE (IF NEEDED) ---------- */
  try {
    if (compileCmd) {
      await runCommand(compileCmd, null, jobDir);
    }
  } catch (err) {
    fs.rmSync(jobDir, { recursive: true, force: true });
    return {
      verdict: "CE",
      passed: 0,
      total: testcases.length,
      results: [{
        input: "",
        expected: "",
        actual: err.message,
        status: "CE"
      }]
    };
  }

  let passed = 0;
  const results = [];

  /* ---------- RUN TEST CASES ---------- */
  for (let i = 0; i < testcases.length; i++) {
    const tc = testcases[i];

    try {
      const actualOutput = await runCommand(runCmd, tc.input, jobDir);

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

      // Stop on first failure (as per your logic)
      if (status === "FAIL") break;

    } catch (err) {
      results.push({
        input: tc.input,
        expected: tc.output,
        actual: err.message || "",
        status: err.type || "RE"
      });
      break;
    }
  }

  /* ---------- CLEANUP ---------- */
  fs.rmSync(jobDir, { recursive: true, force: true });

  return {
    verdict: passed === testcases.length ? "AC" : "WA",
    passed,
    total: testcases.length,
    results
  };
}

module.exports = { executeCode };
