import { AutoDisposable } from "@yume-chan/event";
import type { Consumable, ReadableStream } from "@yume-chan/stream-extra";
import type { Adb } from "../../adb.js";
import type { AdbSocket } from "../../socket/index.js";
import type { AdbSyncEntry } from "./list.js";
import { AdbSyncSocket } from "./socket.js";
/**
 * A simplified `dirname` function that only handles absolute unix paths.
 * @param path an absolute unix path
 * @returns the directory name of the input path
 */
export declare function dirname(path: string): string;
export interface AdbSyncWriteOptions {
    filename: string;
    file: ReadableStream<Consumable<Uint8Array>>;
    mode?: number;
    mtime?: number;
    dryRun?: boolean;
}
export declare class AdbSync extends AutoDisposable {
    protected _adb: Adb;
    protected _socket: AdbSyncSocket;
    private _supportsStat;
    private _supportsListV2;
    private _fixedPushMkdir;
    private _supportsSendReceiveV2;
    private _needPushMkdirWorkaround;
    get supportsStat(): boolean;
    get supportsListV2(): boolean;
    get fixedPushMkdir(): boolean;
    get supportsSendReceiveV2(): boolean;
    get needPushMkdirWorkaround(): boolean;
    constructor(adb: Adb, socket: AdbSocket);
    lstat(path: string): Promise<import("./stat.js").AdbSyncStat>;
    stat(path: string): Promise<{
        id: import("./response.js").AdbSyncResponseId.Stat;
        readonly type: import("./stat.js").LinuxFileType;
        readonly permission: number;
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
    }>;
    isDirectory(path: string): Promise<boolean>;
    opendir(path: string): AsyncGenerator<AdbSyncEntry, void, void>;
    readdir(path: string): Promise<AdbSyncEntry[]>;
    /**
     * Read the content of a file on device.
     *
     * @param filename The full path of the file on device to read.
     * @returns A `ReadableStream` that reads from the file.
     */
    read(filename: string): ReadableStream<Uint8Array>;
    /**
     * Write (or overwrite) a file on device.
     *
     * @param filename The full path of the file on device to write.
     * @param file The content to write.
     * @param mode The unix permissions of the file.
     * @param mtime The modified time of the file.
     * @returns A `WritableStream` that writes to the file.
     */
    write(options: AdbSyncWriteOptions): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=sync.d.ts.map