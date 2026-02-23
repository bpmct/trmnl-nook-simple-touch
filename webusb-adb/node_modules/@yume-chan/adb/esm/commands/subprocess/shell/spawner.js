import { ConcatBufferStream, ConcatStringStream, TextDecoderStream, } from "@yume-chan/stream-extra";
import { splitCommand } from "../utils.js";
export class AdbShellProtocolSpawner {
    #spawn;
    constructor(spawn) {
        this.#spawn = spawn;
    }
    spawn(command, signal) {
        signal?.throwIfAborted();
        if (typeof command === "string") {
            command = splitCommand(command);
        }
        return this.#spawn(command, signal);
    }
    async spawnWait(command) {
        const process = await this.spawn(command);
        const [stdout, stderr, exitCode] = await Promise.all([
            process.stdout.pipeThrough(new ConcatBufferStream()),
            process.stderr.pipeThrough(new ConcatBufferStream()),
            process.exited,
        ]);
        return { stdout, stderr, exitCode };
    }
    async spawnWaitText(command) {
        const process = await this.spawn(command);
        const [stdout, stderr, exitCode] = await Promise.all([
            process.stdout
                .pipeThrough(new TextDecoderStream())
                .pipeThrough(new ConcatStringStream()),
            process.stderr
                .pipeThrough(new TextDecoderStream())
                .pipeThrough(new ConcatStringStream()),
            process.exited,
        ]);
        return { stdout, stderr, exitCode };
    }
}
//# sourceMappingURL=spawner.js.map