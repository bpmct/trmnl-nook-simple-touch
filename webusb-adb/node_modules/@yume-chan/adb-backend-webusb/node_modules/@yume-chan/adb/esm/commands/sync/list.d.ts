import Struct from "@yume-chan/struct";
import { AdbSyncResponseId } from "./response.js";
import type { AdbSyncSocket } from "./socket.js";
import type { AdbSyncStat } from "./stat.js";
export interface AdbSyncEntry extends AdbSyncStat {
    name: string;
}
export declare const AdbSyncEntryResponse: Struct<{
    mode: number;
    size: number;
    mtime: number;
    nameLength: number;
    name: string;
}, "nameLength", {
    readonly type: import("./stat.js").LinuxFileType;
    readonly permission: number;
    id: AdbSyncResponseId.Entry;
}, undefined>;
export type AdbSyncEntryResponse = (typeof AdbSyncEntryResponse)["TDeserializeResult"];
export declare const AdbSyncEntry2Response: Struct<{
    error: import("./stat.js").AdbSyncStatErrorCode;
    dev: bigint;
    ino: bigint;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    size: bigint;
    atime: bigint;
    mtime: bigint;
    ctime: bigint;
    nameLength: number;
    name: string;
}, "nameLength", {
    readonly type: import("./stat.js").LinuxFileType;
    readonly permission: number;
    id: AdbSyncResponseId.Entry2;
}, undefined>;
export type AdbSyncEntry2Response = (typeof AdbSyncEntry2Response)["TDeserializeResult"];
export declare function adbSyncOpenDirV2(socket: AdbSyncSocket, path: string): AsyncGenerator<AdbSyncEntry2Response, void, void>;
export declare function adbSyncOpenDirV1(socket: AdbSyncSocket, path: string): AsyncGenerator<AdbSyncEntryResponse, void, void>;
export declare function adbSyncOpenDir(socket: AdbSyncSocket, path: string, v2: boolean): AsyncGenerator<AdbSyncEntry, void, void>;
//# sourceMappingURL=list.d.ts.map