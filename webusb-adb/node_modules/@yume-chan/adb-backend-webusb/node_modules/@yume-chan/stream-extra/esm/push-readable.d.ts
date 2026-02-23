import type { AbortSignal, QueuingStrategy } from "./stream.js";
import { ReadableStream } from "./stream.js";
export interface PushReadableStreamController<T> {
    abortSignal: AbortSignal;
    enqueue(chunk: T): Promise<void>;
    close(): void;
    error(e?: unknown): void;
}
export type PushReadableStreamSource<T> = (controller: PushReadableStreamController<T>) => void | Promise<void>;
export declare class PushReadableStream<T> extends ReadableStream<T> {
    /**
     * Create a new `PushReadableStream` from a source.
     *
     * @param source If `source` returns a `Promise`, the stream will be closed
     * when the `Promise` is resolved, and be errored when the `Promise` is rejected.
     * @param strategy
     */
    constructor(source: PushReadableStreamSource<T>, strategy?: QueuingStrategy<T>);
}
//# sourceMappingURL=push-readable.d.ts.map