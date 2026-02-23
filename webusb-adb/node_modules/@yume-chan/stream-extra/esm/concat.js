import { PromiseResolver } from "@yume-chan/async";
import { EmptyUint8Array } from "@yume-chan/struct";
import { ReadableStream, WritableStream } from "./stream.js";
// `TransformStream` only calls its `source.flush` method when its `readable` is being read.
// If the user want to use the `Promise` interface, the `flush` method will never be called,
// so the `PromiseResolver` will never be resolved.
// Thus we need to implement our own `TransformStream` using a `WritableStream` and a `ReadableStream`.
/**
 * A `TransformStream` that concatenates strings.
 *
 * Its `readable` is also a `Promise<string>`, so it's possible to `await` it to get the result.
 *
 * ```ts
 * const result: string = await readable.pipeThrough(new ConcatStringStream());
 * ```
 */
export class ConcatStringStream {
    // PERF: rope (concat strings) is faster than `[].join('')`
    #result = "";
    #resolver = new PromiseResolver();
    #writable = new WritableStream({
        write: (chunk) => {
            this.#result += chunk;
        },
        close: () => {
            this.#resolver.resolve(this.#result);
            this.#readableController.enqueue(this.#result);
            this.#readableController.close();
        },
        abort: (reason) => {
            this.#resolver.reject(reason);
            this.#readableController.error(reason);
        },
    });
    get writable() {
        return this.#writable;
    }
    #readableController;
    #readable = new ReadableStream({
        start: (controller) => {
            this.#readableController = controller;
        },
    });
    get readable() {
        return this.#readable;
    }
    constructor() {
        void Object.defineProperties(this.#readable, {
            then: {
                get: () => this.#resolver.promise.then.bind(this.#resolver.promise),
            },
            catch: {
                get: () => this.#resolver.promise.catch.bind(this.#resolver.promise),
            },
            finally: {
                get: () => this.#resolver.promise.finally.bind(this.#resolver.promise),
            },
        });
    }
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
export class ConcatBufferStream {
    #segments = [];
    #resolver = new PromiseResolver();
    #writable = new WritableStream({
        write: (chunk) => {
            this.#segments.push(chunk);
        },
        close: () => {
            let result;
            let offset = 0;
            switch (this.#segments.length) {
                case 0:
                    result = EmptyUint8Array;
                    break;
                case 1:
                    result = this.#segments[0];
                    break;
                default:
                    result = new Uint8Array(this.#segments.reduce((prev, item) => prev + item.length, 0));
                    for (const segment of this.#segments) {
                        result.set(segment, offset);
                        offset += segment.length;
                    }
                    break;
            }
            this.#resolver.resolve(result);
            this.#readableController.enqueue(result);
            this.#readableController.close();
        },
        abort: (reason) => {
            this.#resolver.reject(reason);
            this.#readableController.error(reason);
        },
    });
    get writable() {
        return this.#writable;
    }
    #readableController;
    #readable = new ReadableStream({
        start: (controller) => {
            this.#readableController = controller;
        },
    });
    get readable() {
        return this.#readable;
    }
    constructor() {
        void Object.defineProperties(this.#readable, {
            then: {
                get: () => this.#resolver.promise.then.bind(this.#resolver.promise),
            },
            catch: {
                get: () => this.#resolver.promise.catch.bind(this.#resolver.promise),
            },
            finally: {
                get: () => this.#resolver.promise.finally.bind(this.#resolver.promise),
            },
        });
    }
}
//# sourceMappingURL=concat.js.map