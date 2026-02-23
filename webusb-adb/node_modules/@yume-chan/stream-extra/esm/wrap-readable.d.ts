import type { MaybePromiseLike } from "@yume-chan/async";
import type { QueuingStrategy, ReadableStreamDefaultController } from "./stream.js";
import { ReadableStream } from "./stream.js";
export type WrapReadableStreamStart<T> = (controller: ReadableStreamDefaultController<T>) => MaybePromiseLike<ReadableStream<T>>;
export interface ReadableStreamWrapper<T> {
    start: WrapReadableStreamStart<T>;
    cancel?: (reason?: unknown) => MaybePromiseLike<void>;
    close?: () => MaybePromiseLike<void>;
    error?: (reason?: unknown) => MaybePromiseLike<void>;
}
/**
 * This class has multiple usages:
 *
 * 1. Get notified when the stream is cancelled or closed.
 * 2. Synchronously create a `ReadableStream` by asynchronously return another `ReadableStream`.
 * 3. Convert native `ReadableStream`s to polyfilled ones so they can `pipe` between.
 */
export declare class WrapReadableStream<T> extends ReadableStream<T> {
    #private;
    readable: ReadableStream<T>;
    constructor(wrapper: ReadableStream<T> | WrapReadableStreamStart<T> | ReadableStreamWrapper<T>, strategy?: QueuingStrategy<T>);
}
//# sourceMappingURL=wrap-readable.d.ts.map