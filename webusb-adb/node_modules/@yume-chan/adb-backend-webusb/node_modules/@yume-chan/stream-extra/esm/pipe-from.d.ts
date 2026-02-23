import type { ReadableWritablePair } from "./stream.js";
import { WritableStream } from "./stream.js";
/**
 * Pipe `pair.readable` to `writable`, then returns `pair.writable`.
 *
 * This is the opposite of `ReadableStream#pipeThrough()`.
 *
 * @param writable The `WritableStream` to write to.
 * @param pair A `TransformStream` that converts chunks.
 * @returns `pair`'s `writable` stream.
 */
export declare function pipeFrom<W, T>(writable: WritableStream<W>, pair: ReadableWritablePair<W, T>): import("web-streams-polyfill").WritableStream<T>;
//# sourceMappingURL=pipe-from.d.ts.map