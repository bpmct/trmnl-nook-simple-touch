import type { ReadableStream } from "@yume-chan/stream-extra";
import { MaybeConsumable, WritableStream } from "@yume-chan/stream-extra";
import type { AdbSocket } from "../../../adb.js";
import type { AdbPtyProcess } from "../pty.js";
export declare class AdbShellProtocolPtyProcess implements AdbPtyProcess<number> {
    #private;
    get input(): WritableStream<MaybeConsumable<Uint8Array<ArrayBufferLike>>>;
    get output(): ReadableStream<Uint8Array<ArrayBufferLike>>;
    get exited(): Promise<number>;
    constructor(socket: AdbSocket);
    resize(rows: number, cols: number): Promise<void>;
    sigint(): Promise<void>;
    kill(): import("@yume-chan/async").MaybePromiseLike<void>;
}
//# sourceMappingURL=pty.d.ts.map