import type { MaybePromiseLike } from "@yume-chan/async";
import type { TransformStream } from "./stream.js";
import { WritableStream } from "./stream.js";
export type WrapWritableStreamStart<T> = () => MaybePromiseLike<WritableStream<T>>;
export interface WritableStreamWrapper<T> {
    start: WrapWritableStreamStart<T>;
    close?(): void | Promise<void>;
}
export declare class WrapWritableStream<T> extends WritableStream<T> {
    #private;
    writable: WritableStream<T>;
    constructor(start: WritableStream<T> | WrapWritableStreamStart<T> | WritableStreamWrapper<T>);
    bePipedThroughFrom<U>(transformer: TransformStream<U, T>): WrapWritableStream<U>;
}
//# sourceMappingURL=wrap-writable.d.ts.map