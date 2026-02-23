import { ConcatBufferStream, ConcatStringStream, TextDecoderStream, } from "@yume-chan/stream-extra";
import { splitCommand } from "../utils.js";
export class AdbNoneProtocolSpawner {
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
        return await process.output.pipeThrough(new ConcatBufferStream());
    }
    async spawnWaitText(command) {
        const process = await this.spawn(command);
        return await process.output
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(new ConcatStringStream());
    }
}
//# sourceMappingURL=spawner.js.map