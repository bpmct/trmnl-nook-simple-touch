import type { MaybePromiseLike } from "@yume-chan/async";
import type { ReadableStream, WritableStream } from "@yume-chan/stream-extra";
import { MaybeConsumable } from "@yume-chan/stream-extra";
import type { AdbSocket } from "../../../adb.js";
import type { AdbPtyProcess } from "../pty.js";
export declare class AdbNoneProtocolPtyProcess implements AdbPtyProcess<undefined> {
    #private;
    get input(): WritableStream<MaybeConsumable<Uint8Array>>;
    get output(): ReadableStream<Uint8Array>;
    get exited(): Promise<undefined>;
    constructor(socket: AdbSocket);
    sigint(): Promise<void>;
    kill(): MaybePromiseLike<void>;
}
//# sourceMappingURL=pty.d.ts.map