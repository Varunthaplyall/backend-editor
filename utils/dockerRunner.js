const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function runInDocker({ language_id, source_code, stdin }) {
  // 1. Generate unique folder
  const id = uuidv4();
  const tempDir = path.join(__dirname, "..", "temp", id);

  await fs.ensureDir(tempDir);

  // 2. Map language_id to file extension and Docker image (extendable)
  const languageMap = {
    71: { ext: "py", image: "python:3.10-slim", cmd: "python code.py" },
    // Add more languages here
  };

  const lang = languageMap[language_id];
  if (!lang) throw new Error("Unsupported language");

  const codeFilePath = path.join(tempDir, `code.${lang.ext}`);
  const inputFilePath = path.join(tempDir, `input.txt`);

  // 3. Write code and input to files
  await fs.writeFile(codeFilePath, source_code);
  await fs.writeFile(inputFilePath, stdin || "");

  return new Promise((resolve, reject) => {
    // 4. Docker run command
    // Mount tempDir to /app inside container
    // Use -i for interactive to pipe input
    // Use --rm to clean up container automatically
    const dockerCmd = `docker run --rm -i -v ${tempDir}:/app -w /app ${lang.image} sh -c "${lang.cmd}"`;

    const proc = exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
      // 7. Clean up temp folder
      fs.remove(tempDir).catch(() => {});

      if (error) {
        if (error.killed) {
          // Process killed by timeout
          return resolve({ stdout: "", stderr: "Execution timed out", status: { description: "Timeout" } });
        }
        return resolve({ stdout, stderr, status: { description: "Error" } });
      }

      resolve({ stdout, stderr, status: { description: "Accepted" } });
    });

    // 5. Pipe stdin to container's process
    if (stdin) {
      proc.stdin.write(stdin);
    }
    proc.stdin.end();
  });
}

module.exports = { runInDocker };
