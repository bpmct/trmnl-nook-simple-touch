import { exec } from "node:child_process";
import { writeFileSync } from "node:fs";
import { rm } from "node:fs/promises";

function execAsync(command) {
    return new Promise((resolve, reject) =>
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        })
    );
}

await Promise.all([
    rm("cjs", { recursive: true, force: true }),
    rm("esm", { recursive: true, force: true }),
    rm("dts", { recursive: true, force: true }),
]);

await Promise.all([
    execAsync("tsc -p tsconfig.cjs.json"),
    execAsync("tsc -p tsconfig.esm.json"),
]);

await Promise.all([
    writeFileSync("cjs/package.json", JSON.stringify({ type: "commonjs" })),
    writeFileSync("esm/package.json", JSON.stringify({ type: "module" })),
]);
