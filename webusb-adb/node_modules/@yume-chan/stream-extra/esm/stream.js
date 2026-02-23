export * from "./types.js";
export { ReadableStream };
export const { AbortController } = globalThis;
const ReadableStream = /* #__PURE__ */ (() => {
    const { ReadableStream } = globalThis;
    if (!ReadableStream.from) {
        ReadableStream.from = function (iterable) {
            const iterator = Symbol.asyncIterator in iterable
                ? iterable[Symbol.asyncIterator]()
                : iterable[Symbol.iterator]();
            return new ReadableStream({
                async pull(controller) {
                    const result = await iterator.next();
                    if (result.done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(result.value);
                },
                async cancel(reason) {
                    await iterator.return?.(reason);
                },
            });
        };
    }
    if (!ReadableStream.prototype[Symbol.asyncIterator] ||
        !ReadableStream.prototype.values) {
        ReadableStream.prototype.values = async function* (options) {
            const reader = this.getReader();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        return;
                    }
                    yield value;
                }
            }
            finally {
                // Calling `iterator.return` will enter this `finally` block.
                // We don't need to care about the parameter to `iterator.return`,
                // it will be returned as the final `result.value` automatically.
                if (!options?.preventCancel) {
                    await reader.cancel();
                }
                reader.releaseLock();
            }
        };
        ReadableStream.prototype[Symbol.asyncIterator] =
            // eslint-disable-next-line @typescript-eslint/unbound-method
            ReadableStream.prototype.values;
    }
    return ReadableStream;
})();
export const { WritableStream, TransformStream } = globalThis;
//# sourceMappingURL=stream.js.map