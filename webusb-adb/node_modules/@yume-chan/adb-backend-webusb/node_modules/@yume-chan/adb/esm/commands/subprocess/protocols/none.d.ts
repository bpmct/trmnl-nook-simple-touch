import { ReadableStream } from "@yume-chan/stream-extra";
import type { Adb } from "../../../adb.js";
import type { AdbSocket } from "../../../socket/index.js";
import type { AdbSubprocessProtocol } from "./types.js";
/**
 * The legacy shell
 *
 * Features:
 * * `stderr`: No
 * * `exit` exit code: No
 * * `resize`: No
 */
export declare class AdbSubprocessNoneProtocol implements AdbSubprocessProtocol {
    static isSupported(): boolean;
    static pty(adb: Adb, command: string): Promise<AdbSubprocessNoneProtocol>;
    static raw(adb: Adb, command: string): Promise<AdbSubprocessNoneProtocol>;
    private readonly socket;
    private readonly duplex;
    get stdin(): import("@yume-chan/stream-extra").WritableStream<import("@yume-chan/stream-extra").Consumable<Uint8Array>>;
    private _stdout;
    /**
     * Legacy shell mixes stdout and stderr.
     */
    get stdout(): ReadableStream<Uint8Array>;
    private _stderr;
    /**
     * `stderr` will always be empty.
     */
    get stderr(): ReadableStream<Uint8Array>;
    private _exit;
    get exit(): Promise<number>;
    constructor(socket: AdbSocket);
    resize(): void;
    kill(): Promise<void>;
}
//# sourceMappingURL=none.d.ts.map