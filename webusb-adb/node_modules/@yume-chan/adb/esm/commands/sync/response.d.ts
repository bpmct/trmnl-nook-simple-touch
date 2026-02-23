import type { AsyncExactReadable, StructDeserializer } from "@yume-chan/struct";
/**
 * Encode ID to numbers for faster comparison
 * @param value A 4-character string
 * @returns A 32-bit integer by encoding the string as little-endian
 *
 * #__NO_SIDE_EFFECTS__
 */
export declare function adbSyncEncodeId(value: string): number;
export declare const AdbSyncResponseId: {
    Entry: number;
    Entry2: number;
    Lstat: number;
    Stat: number;
    Lstat2: number;
    Done: number;
    Data: number;
    Ok: number;
    Fail: number;
};
export declare class AdbSyncError extends Error {
}
export declare const AdbSyncFailResponse: import("@yume-chan/struct").Struct<{
    message: import("@yume-chan/struct").Field<string, string, never, string>;
}, undefined, never>;
export declare function adbSyncReadResponse<T>(stream: AsyncExactReadable, id: number | string, type: StructDeserializer<T>): Promise<T>;
export declare function adbSyncReadResponses<T>(stream: AsyncExactReadable, id: number | string, type: StructDeserializer<T>): AsyncGenerator<T, void, void>;
//# sourceMappingURL=response.d.ts.map