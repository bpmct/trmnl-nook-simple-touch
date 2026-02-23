import { DecodeUtf8Stream, GatherStringStream } from "@yume-chan/stream-extra";
import { AdbCommandBase } from "../base.js";
import { AdbSubprocessNoneProtocol, AdbSubprocessShellProtocol, } from "./protocols/index.js";
const DEFAULT_OPTIONS = {
    protocols: [AdbSubprocessShellProtocol, AdbSubprocessNoneProtocol],
};
export class AdbSubprocess extends AdbCommandBase {
    async createProtocol(mode, command, options) {
        const { protocols } = { ...DEFAULT_OPTIONS, ...options };
        let Constructor;
        for (const item of protocols) {
            // It's async so can't use `Array#find`
            if (await item.isSupported(this.adb)) {
                Constructor = item;
                break;
            }
        }
        if (!Constructor) {
            throw new Error("No specified protocol is supported by the device");
        }
        if (Array.isArray(command)) {
            command = command.join(" ");
        }
        else if (command === undefined) {
            // spawn the default shell
            command = "";
        }
        return await Constructor[mode](this.adb, command);
    }
    /**
     * Spawns an executable in PTY mode.
     *
     * Redirection mode is enough for most simple commands, but PTY mode is required for
     * commands that manipulate the terminal, such as `vi` and `less`.
     * @param command The command to run. If omitted, the default shell will be spawned.
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns A new `AdbSubprocessProtocol` instance connecting to the spawned process.
     */
    shell(command, options) {
        return this.createProtocol("pty", command, options);
    }
    /**
     * Spawns an executable and redirect the standard input/output stream.
     *
     * Redirection mode is enough for most simple commands, but PTY mode is required for
     * commands that manipulate the terminal, such as `vi` and `less`.
     * @param command The command to run, or an array of strings containing both command and args.
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns A new `AdbSubprocessProtocol` instance connecting to the spawned process.
     */
    spawn(command, options) {
        return this.createProtocol("raw", command, options);
    }
    /**
     * Spawns a new process, waits until it exits, and returns the entire output.
     * @param command The command to run
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns The entire output of the command
     */
    async spawnAndWait(command, options) {
        const shell = await this.spawn(command, options);
        const stdout = new GatherStringStream();
        const stderr = new GatherStringStream();
        const [, , exitCode] = await Promise.all([
            shell.stdout.pipeThrough(new DecodeUtf8Stream()).pipeTo(stdout),
            shell.stderr.pipeThrough(new DecodeUtf8Stream()).pipeTo(stderr),
            shell.exit,
        ]);
        return {
            stdout: stdout.result,
            stderr: stderr.result,
            exitCode,
        };
    }
    /**
     * Spawns a new process, waits until it exits, and returns the entire output.
     * @param command The command to run
     * @returns The entire output of the command
     */
    async spawnAndWaitLegacy(command) {
        const { stdout } = await this.spawnAndWait(command, {
            protocols: [AdbSubprocessNoneProtocol],
        });
        return stdout;
    }
}
//# sourceMappingURL=command.js.map