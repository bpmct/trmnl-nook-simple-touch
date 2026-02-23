import { ReadableStream } from "./stream.js";
function getWrappedReadableStream(wrapper, controller) {
    if ("start" in wrapper) {
        return wrapper.start(controller);
    }
    else if (typeof wrapper === "function") {
        return wrapper(controller);
    }
    else {
        // Can't use `wrapper instanceof ReadableStream`
        // Because we want to be compatible with any ReadableStream-like objects
        return wrapper;
    }
}
/**
 * This class has multiple usages:
 *
 * 1. Get notified when the stream is cancelled or closed.
 * 2. Synchronously create a `ReadableStream` by asynchronously return another `ReadableStream`.
 * 3. Convert native `ReadableStream`s to polyfilled ones so they can `pipe` between.
 */
export class WrapReadableStream extends ReadableStream {
    readable;
    #reader;
    constructor(wrapper, strategy) {
        super({
            start: async (controller) => {
                const readable = await getWrappedReadableStream(wrapper, controller);
                // `start` is called in `super()`, so can't use `this` synchronously.
                // but it's fine after the first `await`
                this.readable = readable;
                this.#reader = this.readable.getReader();
            },
            pull: async (controller) => {
                const { done, value } = await this.#reader
                    .read()
                    .catch((e) => {
                    if ("error" in wrapper) {
                        wrapper.error(e);
                    }
                    throw e;
                });
                if (done) {
                    controller.close();
                    if ("close" in wrapper) {
                        await wrapper.close?.();
                    }
                }
                else {
                    controller.enqueue(value);
                }
            },
            cancel: async (reason) => {
                await this.#reader.cancel(reason);
                if ("cancel" in wrapper) {
                    await wrapper.cancel?.(reason);
                }
            },
        }, strategy);
    }
}
//# sourceMappingURL=wrap-readable.js.map