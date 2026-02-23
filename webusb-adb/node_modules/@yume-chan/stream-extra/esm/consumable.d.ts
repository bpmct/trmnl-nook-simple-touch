import type { ConsumableReadableStreamController, ConsumableReadableStreamSource, ConsumableWritableStreamSink } from "./consumable/index.js";
import { ConsumableReadableStream, ConsumableWrapByteReadableStream, ConsumableWrapWritableStream, ConsumableWritableStream } from "./consumable/index.js";
export declare class Consumable<T> {
    #private;
    static readonly WritableStream: typeof ConsumableWritableStream;
    static readonly WrapWritableStream: typeof ConsumableWrapWritableStream;
    static readonly ReadableStream: typeof ConsumableReadableStream;
    static readonly WrapByteReadableStream: typeof ConsumableWrapByteReadableStream;
    readonly value: T;
    readonly consumed: Promise<void>;
    constructor(value: T);
    consume(): void;
    error(error: unknown): void;
    tryConsume<U>(callback: (value: T) => U): U;
}
export declare namespace Consumable {
    type WritableStreamSink<T> = ConsumableWritableStreamSink<T>;
    type WritableStream<in T> = typeof ConsumableWritableStream<T>;
    type WrapWritableStream<in T> = typeof ConsumableWrapWritableStream<T>;
    type ReadableStreamController<T> = ConsumableReadableStreamController<T>;
    type ReadableStreamSource<T> = ConsumableReadableStreamSource<T>;
    type ReadableStream<T> = typeof ConsumableReadableStream<T>;
    type WrapByteReadableStream = typeof ConsumableWrapByteReadableStream;
}
//# sourceMappingURL=consumable.d.ts.map