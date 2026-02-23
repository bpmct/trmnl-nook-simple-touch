import { Consumable } from "../consumable.js";
import { WritableStream } from "../stream.js";
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
                    return strategy.size(chunk instanceof Consumable ? chunk.value : chunk);
                };
            }
        }
        super({
            start(controller) {
                return sink.start?.(controller);
            },
            write(chunk, controller) {
                return chunk.tryConsume((chunk) => sink.write?.(chunk, controller));
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
//# sourceMappingURL=writable.js.map