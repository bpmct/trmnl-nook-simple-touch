import { Consumable } from "../consumable.js";
import { WritableStream } from "../stream.js";
import { tryConsume } from "./utils.js";
export class MaybeConsumableWritableStream extends WritableStream {
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
                return tryConsume(chunk, (chunk) => sink.write?.(chunk, controller));
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