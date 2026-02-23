import type { MaybePromiseLike } from "@yume-chan/async";
import type { AsyncExactReadable } from "@yume-chan/struct";
import type { ReadableStream, ReadableStreamDefaultReader } from "./stream.js";
export declare class BufferedReadableStream implements AsyncExactReadable {
    #private;
    get position(): number;
    protected readonly stream: ReadableStream<Uint8Array>;
    protected readonly reader: ReadableStreamDefaultReader<Uint8Array>;
    constructor(stream: ReadableStream<Uint8Array>);
    iterateExactly(length: number): Iterator<MaybePromiseLike<Uint8Array>, void, void>;
    readExactly: (this: BufferedReadableStream, length: number) => MaybePromiseLike<Uint8Array<ArrayBufferLike>>;
    /**
     * Return a readable stream with unconsumed data (if any) and
     * all data from the wrapped stream.
     * @returns A `ReadableStream`
     */
    release(): ReadableStream<Uint8Array>;
    cancel(reason?: unknown): Promise<void>;
}
//# sourceMappingURL=buffered.d.ts.map