import { AdbCommandBase } from "../base.js";
import type { AdbSubprocessProtocol, AdbSubprocessProtocolConstructor } from "./protocols/index.js";
export interface AdbSubprocessOptions {
    /**
     * A list of `AdbSubprocessProtocolConstructor`s to be used.
     *
     * Different `AdbSubprocessProtocol` has different capabilities, thus requires specific adaptations.
     * Check their documentations for details.
     *
     * The first protocol whose `isSupported` returns `true` will be used.
     * If no `AdbSubprocessProtocol` is supported, an error will be thrown.
     *
     * @default [AdbSubprocessShellProtocol, AdbSubprocessNoneProtocol]
     */
    protocols: AdbSubprocessProtocolConstructor[];
}
export interface AdbSubprocessWaitResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export declare class AdbSubprocess extends AdbCommandBase {
    private createProtocol;
    /**
     * Spawns an executable in PTY mode.
     *
     * Redirection mode is enough for most simple commands, but PTY mode is required for
     * commands that manipulate the terminal, such as `vi` and `less`.
     * @param command The command to run. If omitted, the default shell will be spawned.
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns A new `AdbSubprocessProtocol` instance connecting to the spawned process.
     */
    shell(command?: string | string[], options?: Partial<AdbSubprocessOptions>): Promise<AdbSubprocessProtocol>;
    /**
     * Spawns an executable and redirect the standard input/output stream.
     *
     * Redirection mode is enough for most simple commands, but PTY mode is required for
     * commands that manipulate the terminal, such as `vi` and `less`.
     * @param command The command to run, or an array of strings containing both command and args.
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns A new `AdbSubprocessProtocol` instance connecting to the spawned process.
     */
    spawn(command: string | string[], options?: Partial<AdbSubprocessOptions>): Promise<AdbSubprocessProtocol>;
    /**
     * Spawns a new process, waits until it exits, and returns the entire output.
     * @param command The command to run
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns The entire output of the command
     */
    spawnAndWait(command: string | string[], options?: Partial<AdbSubprocessOptions>): Promise<AdbSubprocessWaitResult>;
    /**
     * Spawns a new process, waits until it exits, and returns the entire output.
     * @param command The command to run
     * @returns The entire output of the command
     */
    spawnAndWaitLegacy(command: string | string[]): Promise<string>;
}
//# sourceMappingURL=command.d.ts.map