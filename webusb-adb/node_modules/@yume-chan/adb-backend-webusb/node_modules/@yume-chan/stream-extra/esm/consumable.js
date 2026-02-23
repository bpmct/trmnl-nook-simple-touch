import { PromiseResolver } from "@yume-chan/async";
import { ReadableStream, TransformStream, WritableStream } from "./stream.js";
// `createTask` allows browser DevTools to track the call stack across async boundaries.
const { console } = globalThis;
const createTask = console.createTask?.bind(console) ??
    (() => ({
        run(callback) {
            return callback();
        },
    }));
export class Consumable {
    task;
    resolver;
    value;
    consumed;
    constructor(value) {
        this.task = createTask("Consumable");
        this.value = value;
        this.resolver = new PromiseResolver();
        this.consumed = this.resolver.promise;
    }
    consume() {
        this.resolver.resolve();
    }
    error(error) {
        this.resolver.reject(error);
    }
    async tryConsume(callback) {
        try {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            const result = await this.task.run(() => callback(this.value));
            this.consume();
            return result;
        }
        catch (e) {
            this.resolver.reject(e);
            throw e;
        }
    }
}
async function enqueue(controller, chunk) {
    const output = new Consumable(chunk);
    controller.enqueue(output);
    await output.consumed;
}
export class WrapConsumableStream extends TransformStream {
    constructor() {
        super({
            async transform(chunk, controller) {
                await enqueue(controller, chunk);
            },
        });
    }
}
export class UnwrapConsumableStream extends TransformStream {
    constructor() {
        super({
            transform(chunk, controller) {
                controller.enqueue(chunk.value);
                chunk.consume();
            },
        });
    }
}
export class ConsumableReadableStream extends ReadableStream {
    constructor(source, strategy) {
        let wrappedController;
        let wrappedStrategy;
        if (strategy) {
            wrappedStrategy = {};
            if ("highWaterMark" in strategy) {
                wrappedStrategy.highWaterMark = strategy.highWaterMark;
            }
            if ("size" in strategy) {
                wrappedStrategy.size = (chunk) => {
                    return strategy.size(chunk.value);
                };
            }
        }
        super({
            async start(controller) {
                wrappedController = {
                    async enqueue(chunk) {
                        await enqueue(controller, chunk);
                    },
                    close() {
                        controller.close();
                    },
                    error(reason) {
                        controller.error(reason);
                    },
                };
                await source.start?.(wrappedController);
            },
            async pull() {
                await source.pull?.(wrappedController);
            },
            async cancel(reason) {
                await source.cancel?.(reason);
            },
        }, wrappedStrategy);
    }
}
export class ConsumableWritableStream extends WritableStream {
    static async write(writer, value) {
        const consumable = new Consumable(value);
        await writer.write(consumable);
        await consumable.consumed;
    }
    constructor(sink, strategy) {
        let wrappedStrategy;
        if (strategy) {
            wrappedStrategy = {};
            if ("highWaterMark" in strategy) {
                wrappedStrategy.highWaterMark = strategy.highWaterMark;
            }
            if ("size" in strategy) {
                wrappedStrategy.size = (chunk) => {
                    return strategy.size(chunk.value);
                };
            }
        }
        super({
            start() {
                return sink.start?.();
            },
            async write(chunk) {
                await chunk.tryConsume((value) => sink.write?.(value));
                chunk.consume();
            },
            abort(reason) {
                return sink.abort?.(reason);
            },
            close() {
                return sink.close?.();
            },
        }, wrappedStrategy);
    }
}
export class ConsumableTransformStream extends TransformStream {
    constructor(transformer) {
        let wrappedController;
        super({
            async start(controller) {
                wrappedController = {
                    async enqueue(chunk) {
                        await enqueue(controller, chunk);
                    },
                    close() {
                        controller.terminate();
                    },
                    error(reason) {
                        controller.error(reason);
                    },
                };
                await transformer.start?.(wrappedController);
            },
            async transform(chunk) {
                await chunk.tryConsume((value) => transformer.transform?.(value, wrappedController));
                chunk.consume();
            },
            async flush() {
                await transformer.flush?.(wrappedController);
            },
        });
    }
}
export class ConsumableInspectStream extends TransformStream {
    constructor(callback) {
        super({
            transform(chunk, controller) {
                callback(chunk.value);
                controller.enqueue(chunk);
            },
        });
    }
}
//# sourceMappingURL=consumable.js.map