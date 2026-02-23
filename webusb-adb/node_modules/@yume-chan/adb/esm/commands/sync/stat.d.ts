import type { StructValue } from "@yume-chan/struct";
import type { AdbSyncSocket } from "./socket.js";
export declare const LinuxFileType: {
    readonly Directory: 4;
    readonly File: 8;
    readonly Link: 10;
};
export type LinuxFileType = (typeof LinuxFileType)[keyof typeof LinuxFileType];
export interface AdbSyncStat {
    mode: number;
    size: bigint;
    mtime: bigint;
    get type(): LinuxFileType;
    get permission(): number;
    uid?: number;
    gid?: number;
    atime?: bigint;
    ctime?: bigint;
}
export declare const AdbSyncLstatResponse: import("@yume-chan/struct").Struct<{
    mode: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    mtime: import("@yume-chan/struct").NumberField<number>;
}, {
    readonly type: LinuxFileType;
    readonly permission: number;
}, import("@yume-chan/struct").FieldsValue<{
    mode: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    mtime: import("@yume-chan/struct").NumberField<number>;
}> & {
    readonly type: LinuxFileType;
    readonly permission: number;
}>;
export type AdbSyncLstatResponse = StructValue<typeof AdbSyncLstatResponse>;
export declare const AdbSyncStatErrorCode: {
    readonly SUCCESS: 0;
    readonly EACCES: 13;
    readonly EEXIST: 17;
    readonly EFAULT: 14;
    readonly EFBIG: 27;
    readonly EINTR: 4;
    readonly EINVAL: 22;
    readonly EIO: 5;
    readonly EISDIR: 21;
    readonly ELOOP: 40;
    readonly EMFILE: 24;
    readonly ENAMETOOLONG: 36;
    readonly ENFILE: 23;
    readonly ENOENT: 2;
    readonly ENOMEM: 12;
    readonly ENOSPC: 28;
    readonly ENOTDIR: 20;
    readonly EOVERFLOW: 75;
    readonly EPERM: 1;
    readonly EROFS: 30;
    readonly ETXTBSY: 26;
};
export type AdbSyncStatErrorCode = (typeof AdbSyncStatErrorCode)[keyof typeof AdbSyncStatErrorCode];
export declare const AdbSyncStatResponse: import("@yume-chan/struct").Struct<{
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
}, {
    readonly type: LinuxFileType;
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
}> & {
    readonly type: LinuxFileType;
    readonly permission: number;
}>;
export type AdbSyncStatResponse = StructValue<typeof AdbSyncStatResponse>;
export declare function adbSyncLstat(socket: AdbSyncSocket, path: string, v2: boolean): Promise<AdbSyncStat>;
export declare function adbSyncStat(socket: AdbSyncSocket, path: string): Promise<AdbSyncStatResponse>;
//# sourceMappingURL=stat.d.ts.map