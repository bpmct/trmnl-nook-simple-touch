import { Consumable } from "../consumable.js";
import type { QueuingStrategy } from "../stream.js";
import { ReadableStream } from "../stream.js";
export interface ConsumableReadableStreamController<T> {
    enqueue(chunk: T): Promise<void>;
    close(): void;
    error(reason: unknown): void;
}
export interface ConsumableReadableStreamSource<T> {
    start?(controller: ConsumableReadableStreamController<T>): void | PromiseLike<void>;
    pull?(controller: ConsumableReadableStreamController<T>): void | PromiseLike<void>;
    cancel?(reason: unknown): void | PromiseLike<void>;
}
export declare class ConsumableReadableStream<T> extends ReadableStream<Consumable<T>> {
    static enqueue<T>(controller: {
        enqueue: (chunk: Consumable<T>) => void;
    }, chunk: T): Promise<void>;
    constructor(source: ConsumableReadableStreamSource<T>, strategy?: QueuingStrategy<T>);
}
//# sourceMappingURL=readable.d.ts.map