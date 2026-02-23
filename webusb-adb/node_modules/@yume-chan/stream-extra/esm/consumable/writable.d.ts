import { Consumable } from "../consumable.js";
import type { QueuingStrategy, WritableStreamDefaultController, WritableStreamDefaultWriter } from "../stream.js";
import { WritableStream } from "../stream.js";
export interface ConsumableWritableStreamSink<in T> {
    start?(controller: WritableStreamDefaultController): void | PromiseLike<void>;
    write?(chunk: T, controller: WritableStreamDefaultController): void | PromiseLike<void>;
    abort?(reason: unknown): void | PromiseLike<void>;
    close?(): void | PromiseLike<void>;
}
export declare class ConsumableWritableStream<in T> extends WritableStream<Consumable<T>> {
    static write<T>(writer: WritableStreamDefaultWriter<Consumable<T>>, value: T): Promise<void>;
    constructor(sink: ConsumableWritableStreamSink<T>, strategy?: QueuingStrategy<T>);
}
//# sourceMappingURL=writable.d.ts.map