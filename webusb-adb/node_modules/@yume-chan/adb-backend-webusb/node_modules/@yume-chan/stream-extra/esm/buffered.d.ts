import type { ReadableStream, ReadableStreamDefaultReader } from "./stream.js";
export declare class BufferedReadableStreamEndedError extends Error {
    constructor();
}
export declare class BufferedReadableStream {
    private buffered;
    private bufferedOffset;
    private bufferedLength;
    private _position;
    get position(): number;
    protected readonly stream: ReadableStream<Uint8Array>;
    protected readonly reader: ReadableStreamDefaultReader<Uint8Array>;
    constructor(stream: ReadableStream<Uint8Array>);
    private readSource;
    private readAsync;
    /**
     *
     * @param length
     * @returns
     */
    read(length: number): Uint8Array | Promise<Uint8Array>;
    /**
     * Return a readable stream with unconsumed data (if any) and
     * all data from the wrapped stream.
     * @returns A `ReadableStream`
     */
    release(): ReadableStream<Uint8Array>;
    cancel(reason?: unknown): Promise<void>;
}
//# sourceMappingURL=buffered.d.ts.map