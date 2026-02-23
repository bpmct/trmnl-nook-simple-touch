import type { ValueOrPromise } from "@yume-chan/struct";
import type { ReadableStream } from "./stream.js";
import { WritableStream } from "./stream.js";
import { WrapReadableStream } from "./wrap-readable.js";
export interface DuplexStreamFactoryOptions {
    /**
     * Callback when any `ReadableStream` is cancelled (the user doesn't need any more data),
     * or `WritableStream` is ended (the user won't produce any more data),
     * or `DuplexStreamFactory#close` is called.
     *
     * Usually you want to let the other peer know that the duplex stream should be closed.
     *
     * `dispose` will automatically be called after `close` completes,
     * but if you want to wait another peer for a close confirmation and call
     * `DuplexStreamFactory#dispose` yourself, you can return `false`
     * (or a `Promise` that resolves to `false`) to disable the automatic call.
     */
    close?: (() => ValueOrPromise<boolean | void>) | undefined;
    /**
     * Callback when any `ReadableStream` is closed (the other peer doesn't produce any more data),
     * or `WritableStream` is aborted (the other peer can't receive any more data),
     * or `DuplexStreamFactory#abort` is called.
     *
     * Usually indicates the other peer has closed the duplex stream. You can clean up
     * any resources you have allocated now.
     */
    dispose?: (() => void | Promise<void>) | undefined;
}
/**
 * A factory for creating a duplex stream.
 *
 * It can create multiple `ReadableStream`s and `WritableStream`s,
 * when any of them is closed, all other streams will be closed as well.
 */
export declare class DuplexStreamFactory<R, W> {
    private readableControllers;
    private writers;
    private _writableClosed;
    get writableClosed(): boolean;
    private _closed;
    get closed(): Promise<void>;
    private options;
    constructor(options?: DuplexStreamFactoryOptions);
    wrapReadable(readable: ReadableStream<R>): WrapReadableStream<R>;
    createWritable(stream: WritableStream<W>): WritableStream<W>;
    close(): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=duplex.d.ts.map