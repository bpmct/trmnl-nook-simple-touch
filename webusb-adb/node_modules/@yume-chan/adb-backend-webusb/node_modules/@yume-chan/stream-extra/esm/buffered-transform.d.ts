import type { ValueOrPromise } from "@yume-chan/struct";
import { BufferedReadableStream } from "./buffered.js";
import type { ReadableWritablePair } from "./stream.js";
import { ReadableStream, WritableStream } from "./stream.js";
export declare class BufferedTransformStream<T> implements ReadableWritablePair<T, Uint8Array> {
    private _readable;
    get readable(): ReadableStream<T>;
    private _writable;
    get writable(): WritableStream<Uint8Array>;
    constructor(transform: (stream: BufferedReadableStream) => ValueOrPromise<T>);
}
//# sourceMappingURL=buffered-transform.d.ts.map