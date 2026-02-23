import { ConsumableTransformStream } from "./consumable.js";
/**
 * Splits or combines buffers to specified size.
 */
export declare class BufferCombiner {
    private _capacity;
    private readonly _buffer;
    private _offset;
    private _available;
    constructor(size: number);
    /**
     * Pushes data to the combiner.
     * @param data The input data to be split or combined.
     * @returns
     * A generator that yields buffers of specified size.
     * It may yield the same buffer multiple times, consume the data before calling `next`.
     */
    push(data: Uint8Array): Generator<Uint8Array, void, void>;
    flush(): Uint8Array | undefined;
}
export declare class DistributionStream extends ConsumableTransformStream<Uint8Array, Uint8Array> {
    constructor(size: number, combine?: boolean);
}
//# sourceMappingURL=distribution.d.ts.map