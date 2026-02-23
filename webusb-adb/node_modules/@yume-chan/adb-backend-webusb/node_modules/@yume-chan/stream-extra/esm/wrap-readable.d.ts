import type { ValueOrPromise } from "@yume-chan/struct";
import type { ReadableStreamDefaultController } from "./stream.js";
import { ReadableStream } from "./stream.js";
export type WrapReadableStreamStart<T> = (controller: ReadableStreamDefaultController<T>) => ValueOrPromise<ReadableStream<T>>;
export interface ReadableStreamWrapper<T> {
    start: WrapReadableStreamStart<T>;
    cancel?(reason?: unknown): ValueOrPromise<void>;
    close?(): ValueOrPromise<void>;
}
/**
 * This class has multiple usages:
 *
 * 1. Get notified when the stream is cancelled or closed.
 * 2. Synchronously create a `ReadableStream` by asynchronously return another `ReadableStream`.
 * 3. Convert native `ReadableStream`s to polyfilled ones so they can `pipe` between.
 */
export declare class WrapReadableStream<T> extends ReadableStream<T> {
    readable: ReadableStream<T>;
    private reader;
    constructor(wrapper: ReadableStream<T> | WrapReadableStreamStart<T> | ReadableStreamWrapper<T>);
}
//# sourceMappingURL=wrap-readable.d.ts.map