import type { MaybePromiseLike } from "@yume-chan/async";
import { BufferedReadableStream } from "./buffered.js";
import type { ReadableWritablePair } from "./stream.js";
import { ReadableStream, WritableStream } from "./stream.js";
export declare class BufferedTransformStream<T> implements ReadableWritablePair<T, Uint8Array> {
    #private;
    get readable(): ReadableStream<T>;
    get writable(): WritableStream<Uint8Array<ArrayBufferLike>>;
    constructor(transform: (stream: BufferedReadableStream) => MaybePromiseLike<T>);
}
//# sourceMappingURL=buffered-transform.d.ts.map