import type { MaybePromiseLike } from "@yume-chan/async";
import type { AbortSignal, MaybeConsumable, ReadableStream, WritableStream } from "@yume-chan/stream-extra";
import type { AdbSocket } from "../../../adb.js";
import type { AdbNoneProtocolProcess } from "./spawner.js";
export declare class AdbNoneProtocolProcessImpl implements AdbNoneProtocolProcess {
    #private;
    get stdin(): WritableStream<MaybeConsumable<Uint8Array>>;
    get output(): ReadableStream<Uint8Array>;
    get exited(): Promise<undefined>;
    constructor(socket: AdbSocket, signal?: AbortSignal);
    kill(): MaybePromiseLike<void>;
}
//# sourceMappingURL=process.d.ts.map