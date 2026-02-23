import type { MaybeConsumable } from "../maybe-consumable.js";
import { WritableStream } from "../stream.js";
export declare class MaybeConsumableWrapWritableStream<T> extends WritableStream<MaybeConsumable<T>> {
    constructor(stream: WritableStream<T>);
}
//# sourceMappingURL=wrap-writable.d.ts.map