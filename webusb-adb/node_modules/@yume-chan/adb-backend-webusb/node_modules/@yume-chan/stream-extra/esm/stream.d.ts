import type { AbortSignal } from "web-streams-polyfill";
import { ReadableStream as ReadableStreamPolyfill, TransformStream as TransformStreamPolyfill, WritableStream as WritableStreamPolyfill } from "web-streams-polyfill";
export * from "web-streams-polyfill";
/** A controller object that allows you to abort one or more DOM requests as and when desired. */
export interface AbortController {
    /**
     * Returns the AbortSignal object associated with this object.
     */
    readonly signal: AbortSignal;
    /**
     * Invoking this method will set this object's AbortSignal's aborted flag and signal to any observers that the associated activity is to be aborted.
     */
    abort(reason?: any): void;
}
interface AbortControllerConstructor {
    prototype: AbortController;
    new (): AbortController;
}
export declare const AbortController: AbortControllerConstructor;
export type ReadableStream<R = any> = ReadableStreamPolyfill<R>;
export declare let ReadableStream: typeof ReadableStreamPolyfill;
export type WritableStream<W = any> = WritableStreamPolyfill<W>;
export declare let WritableStream: typeof WritableStreamPolyfill;
export type TransformStream<I = any, O = any> = TransformStreamPolyfill<I, O>;
export declare let TransformStream: typeof TransformStreamPolyfill;
//# sourceMappingURL=stream.d.ts.map