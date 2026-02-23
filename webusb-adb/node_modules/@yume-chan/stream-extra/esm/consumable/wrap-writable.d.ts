import type { Consumable } from "../consumable.js";
import { WritableStream } from "../stream.js";
export declare class ConsumableWrapWritableStream<in T> extends WritableStream<Consumable<T>> {
    constructor(stream: WritableStream<T>);
}
//# sourceMappingURL=wrap-writable.d.ts.map