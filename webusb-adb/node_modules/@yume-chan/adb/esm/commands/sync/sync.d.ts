import type { MaybeConsumable, ReadableStream } from "@yume-chan/stream-extra";
import type { Adb, AdbSocket } from "../../adb.js";
import type { AdbSyncEntry } from "./list.js";
import type { AdbSyncSocketLocked } from "./socket.js";
import { AdbSyncSocket } from "./socket.js";
import type { AdbSyncStat, LinuxFileType } from "./stat.js";
/**
 * A simplified `dirname` function that only handles absolute unix paths.
 * @param path an absolute unix path
 * @returns the directory name of the input path
 */
export declare function dirname(path: string): string;
export interface AdbSyncWriteOptions {
    filename: string;
    file: ReadableStream<MaybeConsumable<Uint8Array>>;
    type?: LinuxFileType;
    permission?: number;
    mtime?: number;
    dryRun?: boolean;
}
export declare class AdbSync {
    #private;
    protected _adb: Adb;
    protected _socket: AdbSyncSocket;
    get supportsStat(): boolean;
    get supportsListV2(): boolean;
    get fixedPushMkdir(): boolean;
    get supportsSendReceiveV2(): boolean;
    get needPushMkdirWorkaround(): boolean;
    constructor(adb: Adb, socket: AdbSocket);
    /**
     * Gets information of a file or folder.
     *
     * If `path` points to a symbolic link, the returned information is about the link itself (with `type` being `LinuxFileType.Link`).
     */
    lstat(path: string): Promise<AdbSyncStat>;
    /**
     * Gets the information of a file or folder.
     *
     * If `path` points to a symbolic link, it will be resolved and the returned information is about the target (with `type` being `LinuxFileType.File` or `LinuxFileType.Directory`).
     */
    stat(path: string): Promise<import("@yume-chan/struct").FieldsValue<{
        error: import("@yume-chan/struct").Field<import("./stat.js").AdbSyncStatErrorCode, never, never, number>;
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
    /**
     * Checks if `path` is a directory, or a symbolic link to a directory.
     *
     * This uses `lstat` internally, thus works on all Android versions.
     */
    isDirectory(path: string): Promise<boolean>;
    opendir(path: string): AsyncGenerator<AdbSyncEntry, void, void>;
    readdir(path: string): Promise<AdbSyncEntry[]>;
    /**
     * Reads the content of a file on device.
     *
     * @param filename The full path of the file on device to read.
     * @returns A `ReadableStream` that contains the file content.
     */
    read(filename: string): ReadableStream<Uint8Array>;
    /**
     * Writes a file on device. If the file name already exists, it will be overwritten.
     *
     * @param options The content and options of the file to write.
     */
    write(options: AdbSyncWriteOptions): Promise<void>;
    lockSocket(): Promise<AdbSyncSocketLocked>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=sync.d.ts.map