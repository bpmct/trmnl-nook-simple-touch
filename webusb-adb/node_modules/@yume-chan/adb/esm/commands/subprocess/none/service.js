import { AdbNoneProtocolProcessImpl } from "./process.js";
import { AdbNoneProtocolPtyProcess } from "./pty.js";
import { AdbNoneProtocolSpawner } from "./spawner.js";
export class AdbNoneProtocolSubprocessService extends AdbNoneProtocolSpawner {
    #adb;
    get adb() {
        return this.#adb;
    }
    constructor(adb) {
        super(async (command, signal) => {
            // `shell,raw:${command}` also triggers raw mode,
            // But is not supported on Android version <7.
            const socket = await this.#adb.createSocket(`exec:${command.join(" ")}`);
            if (signal?.aborted) {
                await socket.close();
                throw signal.reason;
            }
            return new AdbNoneProtocolProcessImpl(socket, signal);
        });
        this.#adb = adb;
    }
    async pty(command) {
        if (command === undefined) {
            command = "";
        }
        else if (Array.isArray(command)) {
            command = command.join(" ");
        }
        return new AdbNoneProtocolPtyProcess(
        // https://github.com/microsoft/typescript/issues/17002
        await this.#adb.createSocket(`shell:${command}`));
    }
}
//# sourceMappingURL=service.js.map