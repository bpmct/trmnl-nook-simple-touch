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
export function pipeFrom(writable, pair) {
    const writer = pair.writable.getWriter();
    const pipe = pair.readable.pipeTo(writable);
    return new WritableStream({
        async write(chunk) {
            await writer.write(chunk);
        },
        async close() {
            await writer.close();
            await pipe;
        },
    });
}
//# sourceMappingURL=pipe-from.js.map