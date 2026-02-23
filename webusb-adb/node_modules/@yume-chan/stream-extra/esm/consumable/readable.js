import { Consumable } from "../consumable.js";
import { ReadableStream } from "../stream.js";
export class ConsumableReadableStream extends ReadableStream {
    static async enqueue(controller, chunk) {
        const output = new Consumable(chunk);
        controller.enqueue(output);
        await output.consumed;
    }
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
            start(controller) {
                wrappedController = {
                    enqueue(chunk) {
                        return ConsumableReadableStream.enqueue(controller, chunk);
                    },
                    close() {
                        controller.close();
                    },
                    error(reason) {
                        controller.error(reason);
                    },
                };
                return source.start?.(wrappedController);
            },
            pull() {
                return source.pull?.(wrappedController);
            },
            cancel(reason) {
                return source.cancel?.(reason);
            },
        }, wrappedStrategy);
    }
}
//# sourceMappingURL=readable.js.map