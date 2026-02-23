import Struct from "@yume-chan/struct";
export declare enum AdbSyncRequestId {
    List = "LIST",
    ListV2 = "LIS2",
    Send = "SEND",
    SendV2 = "SND2",
    Lstat = "STAT",
    Stat = "STA2",
    LstatV2 = "LST2",
    Data = "DATA",
    Done = "DONE",
    Receive = "RECV"
}
export declare const AdbSyncNumberRequest: Struct<{
    id: string;
    arg: number;
}, never, Record<never, never>, undefined>;
export declare const AdbSyncDataRequest: Struct<{
    id: string;
    arg: number;
    data: Uint8Array;
}, "arg", Record<never, never>, undefined>;
export interface AdbSyncWritable {
    write(buffer: Uint8Array): Promise<void>;
}
export declare function adbSyncWriteRequest(writable: AdbSyncWritable, id: AdbSyncRequestId | string, value: number | string | Uint8Array): Promise<void>;
//# sourceMappingURL=request.d.ts.map