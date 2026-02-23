import type { Consumable, ReadableStream } from "@yume-chan/stream-extra";
import { WritableStream } from "@yume-chan/stream-extra";
import type { Adb } from "../../../adb.js";
import type { AdbSocket } from "../../../socket/index.js";
import type { AdbSubprocessProtocol } from "./types.js";
export declare enum AdbShellProtocolId {
    Stdin = 0,
    Stdout = 1,
    Stderr = 2,
    Exit = 3,
    CloseStdin = 4,
    WindowSizeChange = 5
}
/**
 * Shell v2 a.k.a Shell Protocol
 *
 * Features:
 * * `stderr`: Yes
 * * `exit` exit code: Yes
 * * `resize`: Yes
 */
export declare class AdbSubprocessShellProtocol implements AdbSubprocessProtocol {
    static isSupported(adb: Adb): boolean;
    static pty(adb: Adb, command: string): Promise<AdbSubprocessShellProtocol>;
    static raw(adb: Adb, command: string): Promise<AdbSubprocessShellProtocol>;
    private readonly _socket;
    private _socketWriter;
    private _stdin;
    get stdin(): WritableStream<Consumable<Uint8Array>>;
    private _stdout;
    get stdout(): ReadableStream<Uint8Array>;
    private _stderr;
    get stderr(): ReadableStream<Uint8Array>;
    private readonly _exit;
    get exit(): Promise<number>;
    constructor(socket: AdbSocket);
    resize(rows: number, cols: number): Promise<void>;
    kill(): Promise<void>;
}
//# sourceMappingURL=shell.d.ts.map