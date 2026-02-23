import type { MaybeConsumable } from "../maybe-consumable.js";
import type { QueuingStrategy, WritableStreamDefaultController } from "../stream.js";
import { WritableStream } from "../stream.js";
export interface MaybeConsumableWritableStreamSink<in T> {
    start?(controller: WritableStreamDefaultController): void | PromiseLike<void>;
    write?(chunk: T, controller: WritableStreamDefaultController): void | PromiseLike<void>;
    abort?(reason: unknown): void | PromiseLike<void>;
    close?(): void | PromiseLike<void>;
}
export declare class MaybeConsumableWritableStream<in T> extends WritableStream<MaybeConsumable<T>> {
    constructor(sink: MaybeConsumableWritableStreamSink<T>, strategy?: QueuingStrategy<T>);
}
//# sourceMappingURL=writable.d.ts.map