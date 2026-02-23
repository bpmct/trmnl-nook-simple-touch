import type { Consumable, ReadableStream } from "@yume-chan/stream-extra";
import Struct from "@yume-chan/struct";
import { AdbSyncRequestId } from "./request.js";
import type { AdbSyncSocket } from "./socket.js";
export declare const ADB_SYNC_MAX_PACKET_SIZE: number;
export interface AdbSyncPushV1Options {
    socket: AdbSyncSocket;
    filename: string;
    file: ReadableStream<Consumable<Uint8Array>>;
    mode?: number;
    mtime?: number;
    packetSize?: number;
}
export declare const AdbSyncOkResponse: Struct<{
    unused: number;
}, never, Record<never, never>, undefined>;
export declare function adbSyncPushV1({ socket, filename, file, mode, mtime, packetSize, }: AdbSyncPushV1Options): Promise<void>;
export declare enum AdbSyncSendV2Flags {
    None = 0,
    Brotli = 1,
    /**
     * 2
     */
    Lz4 = 2,
    /**
     * 4
     */
    Zstd = 4,
    /**
     * 0x80000000
     */
    DryRun = 2147483648
}
export interface AdbSyncPushV2Options extends AdbSyncPushV1Options {
    dryRun?: boolean;
}
export declare const AdbSyncSendV2Request: Struct<{
    id: AdbSyncRequestId;
    mode: number;
    flags: AdbSyncSendV2Flags;
}, never, Record<never, never>, undefined>;
export declare function adbSyncPushV2({ socket, filename, file, mode, mtime, packetSize, dryRun, }: AdbSyncPushV2Options): Promise<void>;
export interface AdbSyncPushOptions extends AdbSyncPushV2Options {
    v2: boolean;
}
export declare function adbSyncPush(options: AdbSyncPushOptions): Promise<void>;
//# sourceMappingURL=push.d.ts.map