import type { StructValue } from "@yume-chan/struct";
import type { AdbSyncSocket } from "./socket.js";
import type { AdbSyncStat } from "./stat.js";
import { AdbSyncStatErrorCode } from "./stat.js";
export interface AdbSyncEntry extends AdbSyncStat {
    name: string;
}
export declare const AdbSyncEntryResponse: import("@yume-chan/struct").Struct<{
    mode: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    mtime: import("@yume-chan/struct").NumberField<number>;
} & {
    name: import("@yume-chan/struct").Field<string, string, never, string>;
}, {
    readonly type: import("./stat.js").LinuxFileType;
    readonly permission: number;
}, import("@yume-chan/struct").FieldsValue<{
    mode: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    mtime: import("@yume-chan/struct").NumberField<number>;
} & {
    name: import("@yume-chan/struct").Field<string, string, never, string>;
}> & {
    readonly type: import("./stat.js").LinuxFileType;
    readonly permission: number;
}>;
export type AdbSyncEntryResponse = StructValue<typeof AdbSyncEntryResponse>;
export declare const AdbSyncEntry2Response: import("@yume-chan/struct").Struct<{
    error: import("@yume-chan/struct").Field<AdbSyncStatErrorCode, never, never, number>;
    dev: import("@yume-chan/struct").NumberField<bigint>;
    ino: import("@yume-chan/struct").NumberField<bigint>;
    mode: import("@yume-chan/struct").NumberField<number>;
    nlink: import("@yume-chan/struct").NumberField<number>;
    uid: import("@yume-chan/struct").NumberField<number>;
    gid: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<bigint>;
    atime: import("@yume-chan/struct").NumberField<bigint>;
    mtime: import("@yume-chan/struct").NumberField<bigint>;
    ctime: import("@yume-chan/struct").NumberField<bigint>;
} & {
    name: import("@yume-chan/struct").Field<string, string, never, string>;
}, {
    readonly type: import("./stat.js").LinuxFileType;
    readonly permission: number;
}, import("@yume-chan/struct").FieldsValue<{
    error: import("@yume-chan/struct").Field<AdbSyncStatErrorCode, never, never, number>;
    dev: import("@yume-chan/struct").NumberField<bigint>;
    ino: import("@yume-chan/struct").NumberField<bigint>;
    mode: import("@yume-chan/struct").NumberField<number>;
    nlink: import("@yume-chan/struct").NumberField<number>;
    uid: import("@yume-chan/struct").NumberField<number>;
    gid: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<bigint>;
    atime: import("@yume-chan/struct").NumberField<bigint>;
    mtime: import("@yume-chan/struct").NumberField<bigint>;
    ctime: import("@yume-chan/struct").NumberField<bigint>;
} & {
    name: import("@yume-chan/struct").Field<string, string, never, string>;
}> & {
    readonly type: import("./stat.js").LinuxFileType;
    readonly permission: number;
}>;
export type AdbSyncEntry2Response = StructValue<typeof AdbSyncEntry2Response>;
export declare function adbSyncOpenDirV2(socket: AdbSyncSocket, path: string): AsyncGenerator<AdbSyncEntry2Response, void, void>;
export declare function adbSyncOpenDirV1(socket: AdbSyncSocket, path: string): AsyncGenerator<AdbSyncEntryResponse, void, void>;
export declare function adbSyncOpenDir(socket: AdbSyncSocket, path: string, v2: boolean): AsyncGenerator<AdbSyncEntry, void, void>;
//# sourceMappingURL=list.d.ts.map