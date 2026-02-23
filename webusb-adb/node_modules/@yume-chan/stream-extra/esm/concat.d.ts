import { ReadableStream, WritableStream } from "./stream.js";
export interface ConcatStringReadableStream extends ReadableStream<string>, Promise<string> {
}
/**
 * A `TransformStream` that concatenates strings.
 *
 * Its `readable` is also a `Promise<string>`, so it's possible to `await` it to get the result.
 *
 * ```ts
 * const result: string = await readable.pipeThrough(new ConcatStringStream());
 * ```
 */
export declare class ConcatStringStream {
    #private;
    get writable(): WritableStream<string>;
    get readable(): ConcatStringReadableStream;
    constructor();
}
export interface ConcatBufferReadableStream extends ReadableStream<Uint8Array>, Promise<Uint8Array> {
}
/**
 * A `TransformStream` that concatenates `Uint8Array`s.
 *
 * If you want to decode the result as string,
 * prefer `.pipeThrough(new TextDecoderStream()).pipeThrough(new ConcatStringStream())`,
 * than `.pipeThough(new ConcatBufferStream()).pipeThrough(new TextDecoderStream())`,
 * because of JavaScript engine optimizations,
 * concatenating strings is faster than concatenating `Uint8Array`s.
 */
export declare class ConcatBufferStream {
    #private;
    get writable(): WritableStream<Uint8Array>;
    get readable(): ConcatBufferReadableStream;
    constructor();
}
//# sourceMappingURL=concat.d.ts.map