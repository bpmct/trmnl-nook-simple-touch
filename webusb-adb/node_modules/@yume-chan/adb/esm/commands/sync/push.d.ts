import type { ReadableStream } from "@yume-chan/stream-extra";
import { MaybeConsumable } from "@yume-chan/stream-extra";
import type { AdbSyncSocket } from "./socket.js";
import { LinuxFileType } from "./stat.js";
export declare const ADB_SYNC_MAX_PACKET_SIZE: number;
export interface AdbSyncPushV1Options {
    socket: AdbSyncSocket;
    filename: string;
    file: ReadableStream<MaybeConsumable<Uint8Array>>;
    type?: LinuxFileType;
    permission?: number;
    mtime?: number;
    packetSize?: number;
}
export declare const AdbSyncOkResponse: import("@yume-chan/struct").Struct<{
    unused: import("@yume-chan/struct").NumberField<number>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    unused: import("@yume-chan/struct").NumberField<number>;
}>>;
export declare function adbSyncPushV1({ socket, filename, file, type, permission, mtime, packetSize, }: AdbSyncPushV1Options): Promise<void>;
export declare const AdbSyncSendV2Flags: {
    readonly None: 0;
    readonly Brotli: 1;
    /**
     * 2
     */
    readonly Lz4: number;
    /**
     * 4
     */
    readonly Zstd: number;
    readonly DryRun: 2147483648;
};
export type AdbSyncSendV2Flags = (typeof AdbSyncSendV2Flags)[keyof typeof AdbSyncSendV2Flags];
export interface AdbSyncPushV2Options extends AdbSyncPushV1Options {
    /**
     * Don't write the file to disk. Requires the `sendrecv_v2` feature.
     *
     * It was used during ADB development to benchmark the performance of
     * compression algorithms.
     */
    dryRun?: boolean;
}
export declare const AdbSyncSendV2Request: import("@yume-chan/struct").Struct<{
    id: import("@yume-chan/struct").NumberField<number>;
    mode: import("@yume-chan/struct").NumberField<number>;
    flags: import("@yume-chan/struct").Field<number, never, never, number>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    id: import("@yume-chan/struct").NumberField<number>;
    mode: import("@yume-chan/struct").NumberField<number>;
    flags: import("@yume-chan/struct").Field<number, never, never, number>;
}>>;
export declare function adbSyncPushV2({ socket, filename, file, type, permission, mtime, packetSize, dryRun, }: AdbSyncPushV2Options): Promise<void>;
export interface AdbSyncPushOptions extends AdbSyncPushV2Options {
    /**
     * Whether to use the v2 protocol. Requires the `sendrecv_v2` feature.
     */
    v2: boolean;
}
export declare function adbSyncPush(options: AdbSyncPushOptions): Promise<void>;
//# sourceMappingURL=push.d.ts.map