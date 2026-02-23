import { WritableStream } from "./stream.js";
async function getWrappedWritableStream(wrapper) {
    if ("start" in wrapper) {
        return await wrapper.start();
    }
    else if (typeof wrapper === "function") {
        return await wrapper();
    }
    else {
        // Can't use `wrapper instanceof WritableStream`
        // Because we want to be compatible with any WritableStream-like objects
        return wrapper;
    }
}
export class WrapWritableStream extends WritableStream {
    writable;
    writer;
    constructor(wrapper) {
        super({
            start: async () => {
                // `start` is invoked before `ReadableStream`'s constructor finish,
                // so using `this` synchronously causes
                // "Must call super constructor in derived class before accessing 'this' or returning from derived constructor".
                // Queue a microtask to avoid this.
                await Promise.resolve();
                this.writable = await getWrappedWritableStream(wrapper);
                this.writer = this.writable.getWriter();
            },
            write: async (chunk) => {
                await this.writer.write(chunk);
            },
            abort: async (reason) => {
                await this.writer.abort(reason);
                if ("close" in wrapper) {
                    await wrapper.close?.();
                }
            },
            close: async () => {
                // Close the inner stream first.
                // Usually the inner stream is a logical sub-stream over the outer stream,
                // closing the outer stream first will make the inner stream incapable of
                // sending data in its `close` handler.
                await this.writer.close();
                if ("close" in wrapper) {
                    await wrapper.close?.();
                }
            },
        });
    }
    bePipedThroughFrom(transformer) {
        let promise;
        return new WrapWritableStream({
            start: () => {
                promise = transformer.readable.pipeTo(this);
                return transformer.writable;
            },
            async close() {
                await promise;
            },
        });
    }
}
//# sourceMappingURL=wrap-writable.js.map