import type { StructAsyncDeserializeStream, StructLike, StructValueType } from "@yume-chan/struct";
import Struct from "@yume-chan/struct";
export declare enum AdbSyncResponseId {
    Entry = "DENT",
    Entry2 = "DNT2",
    Lstat = "STAT",
    Stat = "STA2",
    Lstat2 = "LST2",
    Done = "DONE",
    Data = "DATA",
    Ok = "OKAY",
    Fail = "FAIL"
}
export declare const AdbSyncFailResponse: Struct<{
    messageLength: number;
    message: string;
}, "messageLength", Record<never, never>, never>;
export declare function adbSyncReadResponse<T>(stream: StructAsyncDeserializeStream, id: AdbSyncResponseId, type: StructLike<T>): Promise<T>;
export declare function adbSyncReadResponses<T extends Struct<object, PropertyKey, object, any>>(stream: StructAsyncDeserializeStream, id: AdbSyncResponseId, type: T): AsyncGenerator<StructValueType<T>, void, void>;
//# sourceMappingURL=response.d.ts.map