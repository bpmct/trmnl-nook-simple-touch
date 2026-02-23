import type { MaybePromiseLike } from "@yume-chan/async";
export declare class ExactReadableEndedError extends Error {
    constructor();
}
export interface ExactReadable {
    readonly position: number;
    /**
     * Read data from the underlying data source.
     *
     * The stream must return exactly `length` bytes or data. If that's not possible
     * (due to end of file or other error condition), it must throw an {@link ExactReadableEndedError}.
     */
    readExactly(length: number): Uint8Array;
}
export declare class Uint8ArrayExactReadable implements ExactReadable {
    #private;
    get position(): number;
    constructor(data: Uint8Array);
    readExactly(length: number): Uint8Array;
}
export interface AsyncExactReadable {
    readonly position: number;
    /**
     * Read data from the underlying data source.
     *
     * The stream must return exactly `length` bytes or data. If that's not possible
     * (due to end of file or other error condition), it must throw an {@link ExactReadableEndedError}.
     */
    readExactly(length: number): MaybePromiseLike<Uint8Array>;
}
//# sourceMappingURL=readable.d.ts.map