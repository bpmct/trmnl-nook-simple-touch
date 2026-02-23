import type { ValueOrPromise } from "@yume-chan/struct";
import type { TransformStream } from "./stream.js";
import { WritableStream } from "./stream.js";
export type WrapWritableStreamStart<T> = () => ValueOrPromise<WritableStream<T>>;
export interface WritableStreamWrapper<T> {
    start: WrapWritableStreamStart<T>;
    close?(): void | Promise<void>;
}
export declare class WrapWritableStream<T> extends WritableStream<T> {
    writable: WritableStream<T>;
    private writer;
    constructor(wrapper: WritableStream<T> | WrapWritableStreamStart<T> | WritableStreamWrapper<T>);
    bePipedThroughFrom<U>(transformer: TransformStream<U, T>): WrapWritableStream<U>;
}
//# sourceMappingURL=wrap-writable.d.ts.map