import { PromiseResolver } from "@yume-chan/async";
import { WritableStream } from "./stream.js";
import { tryClose } from "./try-close.js";
import { WrapReadableStream } from "./wrap-readable.js";
const NOOP = () => {
    // no-op
};
/**
 * A factory for creating a duplex stream.
 *
 * It can create multiple `ReadableStream`s and `WritableStream`s,
 * when any of them is closed, all other streams will be closed as well.
 */
export class DuplexStreamFactory {
    #readableControllers = [];
    #writers = [];
    #writableClosed = false;
    get writableClosed() {
        return this.#writableClosed;
    }
    #closed = new PromiseResolver();
    get closed() {
        return this.#closed.promise;
    }
    #options;
    constructor(options) {
        this.#options = options ?? {};
    }
    wrapReadable(readable, strategy) {
        return new WrapReadableStream({
            start: (controller) => {
                this.#readableControllers.push(controller);
                return readable;
            },
            cancel: async () => {
                // cancel means the local peer wants to close the connection.
                await this.close();
            },
            close: async () => {
                // stream end means the remote peer closed the connection first.
                await this.dispose();
            },
        }, strategy);
    }
    createWritable(stream) {
        const writer = stream.getWriter();
        this.#writers.push(writer);
        // `WritableStream` has no way to tell if the remote peer has closed the connection.
        // So it only triggers `close`.
        return new WritableStream({
            write: async (chunk) => {
                await writer.write(chunk);
            },
            abort: async (reason) => {
                await writer.abort(reason);
                await this.close();
            },
            close: async () => {
                // NOOP: the writer is already closed
                await writer.close().catch(NOOP);
                await this.close();
            },
        });
    }
    async close() {
        if (this.#writableClosed) {
            return;
        }
        this.#writableClosed = true;
        // Call `close` first, so it can still write data to `WritableStream`s.
        if ((await this.#options.close?.()) !== false) {
            // `close` can return `false` to disable automatic `dispose`.
            await this.dispose();
        }
        for (const writer of this.#writers) {
            // NOOP: the writer is already closed
            writer.close().catch(NOOP);
        }
    }
    async dispose() {
        this.#writableClosed = true;
        this.#closed.resolve();
        for (const controller of this.#readableControllers) {
            tryClose(controller);
        }
        await this.#options.dispose?.();
    }
}
//# sourceMappingURL=duplex.js.map