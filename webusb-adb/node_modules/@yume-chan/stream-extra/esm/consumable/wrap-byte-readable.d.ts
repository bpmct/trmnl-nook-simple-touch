import type { Consumable } from "../consumable.js";
import { ReadableStream } from "../stream.js";
export declare class ConsumableWrapByteReadableStream extends ReadableStream<Consumable<Uint8Array>> {
    constructor(stream: ReadableStream<Uint8Array>, chunkSize: number, min?: number);
}
//# sourceMappingURL=wrap-byte-readable.d.ts.map