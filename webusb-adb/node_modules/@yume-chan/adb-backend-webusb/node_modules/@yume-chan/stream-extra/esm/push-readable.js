import { PromiseResolver } from "@yume-chan/async";
import { AbortController, ReadableStream } from "./stream.js";
export class PushReadableStream extends ReadableStream {
    /**
     * Create a new `PushReadableStream` from a source.
     *
     * @param source If `source` returns a `Promise`, the stream will be closed
     * when the `Promise` is resolved, and be errored when the `Promise` is rejected.
     * @param strategy
     */
    constructor(source, strategy) {
        let waterMarkLow;
        const canceled = new AbortController();
        super({
            start: (controller) => {
                const result = source({
                    abortSignal: canceled.signal,
                    async enqueue(chunk) {
                        if (canceled.signal.aborted) {
                            // If the stream is already cancelled,
                            // throw immediately.
                            throw (canceled.signal.reason ??
                                new Error("Aborted"));
                        }
                        // Only when the stream is errored, `desiredSize` will be `null`.
                        // But since `null <= 0` is `true`
                        // (`null <= 0` is evaluated as `!(null > 0)` => `!false` => `true`),
                        // not handling it will cause a deadlock.
                        if ((controller.desiredSize ?? 1) <= 0) {
                            waterMarkLow = new PromiseResolver();
                            await waterMarkLow.promise;
                        }
                        // `controller.enqueue` will throw error for us
                        // if the stream is already errored.
                        controller.enqueue(chunk);
                    },
                    close() {
                        controller.close();
                    },
                    error(e) {
                        controller.error(e);
                    },
                });
                if (result && "then" in result) {
                    result.then(() => {
                        controller.close();
                    }, (e) => {
                        controller.error(e);
                    });
                }
            },
            pull: () => {
                waterMarkLow?.resolve();
            },
            cancel: (reason) => {
                canceled.abort(reason);
                waterMarkLow?.reject(reason);
            },
        }, strategy);
    }
}
//# sourceMappingURL=push-readable.js.map