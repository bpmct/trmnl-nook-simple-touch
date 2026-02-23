import { ReadableStream as ReadableStreamPolyfill, TransformStream as TransformStreamPolyfill, WritableStream as WritableStreamPolyfill, } from "web-streams-polyfill";
export * from "web-streams-polyfill";
const GLOBAL = globalThis;
export const AbortController = GLOBAL.AbortController;
export let ReadableStream = ReadableStreamPolyfill;
export let WritableStream = WritableStreamPolyfill;
export let TransformStream = TransformStreamPolyfill;
if (GLOBAL.ReadableStream && GLOBAL.WritableStream && GLOBAL.TransformStream) {
    // Use browser native implementation
    ReadableStream = GLOBAL.ReadableStream;
    WritableStream = GLOBAL.WritableStream;
    TransformStream = GLOBAL.TransformStream;
}
else {
    // TODO: enable loading Node.js stream implementation when bundler supports Top Level Await
    // try {
    //     // Use Node.js native implementation
    //     const MODULE_NAME = "node:stream/web";
    //     const StreamWeb = (await import(MODULE_NAME)) as GlobalExtension;
    //     ReadableStream = StreamWeb.ReadableStream;
    //     WritableStream = StreamWeb.WritableStream;
    //     TransformStream = StreamWeb.TransformStream;
    // } catch {
    //     // ignore
    // }
}
//# sourceMappingURL=stream.js.map