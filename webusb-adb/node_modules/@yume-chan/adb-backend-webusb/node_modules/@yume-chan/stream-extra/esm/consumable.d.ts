import type { QueuingStrategy, WritableStreamDefaultWriter } from "./stream.js";
import { ReadableStream, TransformStream, WritableStream } from "./stream.js";
export declare class Consumable<T> {
    private readonly task;
    private readonly resolver;
    readonly value: T;
    readonly consumed: Promise<void>;
    constructor(value: T);
    consume(): void;
    error(error: any): void;
    tryConsume<U>(callback: (value: T) => U): Promise<U>;
}
export declare class WrapConsumableStream<T> extends TransformStream<T, Consumable<T>> {
    constructor();
}
export declare class UnwrapConsumableStream<T> extends TransformStream<Consumable<T>, T> {
    constructor();
}
export interface ConsumableReadableStreamController<T> {
    enqueue(chunk: T): Promise<void>;
    close(): void;
    error(reason: any): void;
}
export interface ConsumableReadableStreamSource<T> {
    start?(controller: ConsumableReadableStreamController<T>): void | PromiseLike<void>;
    pull?(controller: ConsumableReadableStreamController<T>): void | PromiseLike<void>;
    cancel?(reason: any): void | PromiseLike<void>;
}
export declare class ConsumableReadableStream<T> extends ReadableStream<Consumable<T>> {
    constructor(source: ConsumableReadableStreamSource<T>, strategy?: QueuingStrategy<T>);
}
export interface ConsumableWritableStreamSink<T> {
    start?(): void | PromiseLike<void>;
    write?(chunk: T): void | PromiseLike<void>;
    abort?(reason: any): void | PromiseLike<void>;
    close?(): void | PromiseLike<void>;
}
export declare class ConsumableWritableStream<T> extends WritableStream<Consumable<T>> {
    static write<T>(writer: WritableStreamDefaultWriter<Consumable<T>>, value: T): Promise<void>;
    constructor(sink: ConsumableWritableStreamSink<T>, strategy?: QueuingStrategy<T>);
}
export interface ConsumableTransformer<I, O> {
    start?(controller: ConsumableReadableStreamController<O>): void | PromiseLike<void>;
    transform?(chunk: I, controller: ConsumableReadableStreamController<O>): void | PromiseLike<void>;
    flush?(controller: ConsumableReadableStreamController<O>): void | PromiseLike<void>;
}
export declare class ConsumableTransformStream<I, O> extends TransformStream<Consumable<I>, Consumable<O>> {
    constructor(transformer: ConsumableTransformer<I, O>);
}
export declare class ConsumableInspectStream<T> extends TransformStream<Consumable<T>, Consumable<T>> {
    constructor(callback: (value: T) => void);
}
//# sourceMappingURL=consumable.d.ts.map