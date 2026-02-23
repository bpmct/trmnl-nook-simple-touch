import { BufferedReadableStream, BufferedReadableStreamEndedError, } from "./buffered.js";
import { PushReadableStream } from "./push-readable.js";
import { ReadableStream, WritableStream } from "./stream.js";
// TODO: BufferedTransformStream: find better implementation
export class BufferedTransformStream {
    _readable;
    get readable() {
        return this._readable;
    }
    _writable;
    get writable() {
        return this._writable;
    }
    constructor(transform) {
        // Convert incoming chunks to a `BufferedReadableStream`
        let sourceStreamController;
        const buffered = new BufferedReadableStream(new PushReadableStream((controller) => {
            sourceStreamController = controller;
        }));
        this._readable = new ReadableStream({
            async pull(controller) {
                try {
                    const value = await transform(buffered);
                    controller.enqueue(value);
                }
                catch (e) {
                    // Treat `BufferedReadableStreamEndedError` as a normal end.
                    // If the `transform` method doesn't have enough data to return a value,
                    // it should throw another error to indicate that.
                    if (e instanceof BufferedReadableStreamEndedError) {
                        controller.close();
                        return;
                    }
                    throw e;
                }
            },
            cancel: (reason) => {
                // Propagate cancel to the source stream
                // So future writes will be rejected
                return buffered.cancel(reason);
            },
        });
        this._writable = new WritableStream({
            async write(chunk) {
                await sourceStreamController.enqueue(chunk);
            },
            abort() {
                sourceStreamController.close();
            },
            close() {
                sourceStreamController.close();
            },
        });
    }
}
//# sourceMappingURL=buffered-transform.js.map