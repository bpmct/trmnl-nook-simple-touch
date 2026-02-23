import type { MaybePromiseLike } from "@yume-chan/async";
import type { AbortSignal, ReadableStream } from "@yume-chan/stream-extra";
import { MaybeConsumable, WritableStream } from "@yume-chan/stream-extra";
import type { AdbSocket } from "../../../adb.js";
import type { AdbShellProtocolProcess } from "./spawner.js";
export declare class AdbShellProtocolProcessImpl implements AdbShellProtocolProcess {
    #private;
    get stdin(): WritableStream<MaybeConsumable<Uint8Array<ArrayBufferLike>>>;
    get stdout(): ReadableStream<Uint8Array<ArrayBufferLike>>;
    get stderr(): ReadableStream<Uint8Array<ArrayBufferLike>>;
    get exited(): Promise<number>;
    constructor(socket: AdbSocket, signal?: AbortSignal);
    kill(): MaybePromiseLike<void>;
}
//# sourceMappingURL=process.d.ts.map