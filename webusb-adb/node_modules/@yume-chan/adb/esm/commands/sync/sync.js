import { AdbFeature } from "../../features.js";
import { escapeArg } from "../subprocess/index.js";
import { adbSyncOpenDir } from "./list.js";
import { adbSyncPull } from "./pull.js";
import { adbSyncPush } from "./push.js";
import { AdbSyncSocket } from "./socket.js";
import { adbSyncLstat, adbSyncStat } from "./stat.js";
/**
 * A simplified `dirname` function that only handles absolute unix paths.
 * @param path an absolute unix path
 * @returns the directory name of the input path
 */
export function dirname(path) {
    const end = path.lastIndexOf("/");
    if (end === -1) {
        throw new Error(`Invalid path`);
    }
    if (end === 0) {
        return "/";
    }
    return path.substring(0, end);
}
export class AdbSync {
    _adb;
    _socket;
    #supportsStat;
    #supportsListV2;
    #fixedPushMkdir;
    #supportsSendReceiveV2;
    #needPushMkdirWorkaround;
    get supportsStat() {
        return this.#supportsStat;
    }
    get supportsListV2() {
        return this.#supportsListV2;
    }
    get fixedPushMkdir() {
        return this.#fixedPushMkdir;
    }
    get supportsSendReceiveV2() {
        return this.#supportsSendReceiveV2;
    }
    get needPushMkdirWorkaround() {
        return this.#needPushMkdirWorkaround;
    }
    constructor(adb, socket) {
        this._adb = adb;
        this._socket = new AdbSyncSocket(socket, adb.maxPayloadSize);
        this.#supportsStat = adb.canUseFeature(AdbFeature.StatV2);
        this.#supportsListV2 = adb.canUseFeature(AdbFeature.ListV2);
        this.#fixedPushMkdir = adb.canUseFeature(AdbFeature.FixedPushMkdir);
        this.#supportsSendReceiveV2 = adb.canUseFeature(AdbFeature.SendReceiveV2);
        // https://android.googlesource.com/platform/packages/modules/adb/+/91768a57b7138166e0a3d11f79cd55909dda7014/client/file_sync_client.cpp#1361
        this.#needPushMkdirWorkaround =
            this._adb.canUseFeature(AdbFeature.ShellV2) && !this.fixedPushMkdir;
    }
    /**
     * Gets information of a file or folder.
     *
     * If `path` points to a symbolic link, the returned information is about the link itself (with `type` being `LinuxFileType.Link`).
     */
    async lstat(path) {
        return await adbSyncLstat(this._socket, path, this.#supportsStat);
    }
    /**
     * Gets the information of a file or folder.
     *
     * If `path` points to a symbolic link, it will be resolved and the returned information is about the target (with `type` being `LinuxFileType.File` or `LinuxFileType.Directory`).
     */
    async stat(path) {
        if (!this.#supportsStat) {
            throw new Error("Not supported");
        }
        return await adbSyncStat(this._socket, path);
    }
    /**
     * Checks if `path` is a directory, or a symbolic link to a directory.
     *
     * This uses `lstat` internally, thus works on all Android versions.
     */
    async isDirectory(path) {
        try {
            await this.lstat(path + "/");
            return true;
        }
        catch {
            return false;
        }
    }
    opendir(path) {
        return adbSyncOpenDir(this._socket, path, this.supportsListV2);
    }
    async readdir(path) {
        const results = [];
        for await (const entry of this.opendir(path)) {
            results.push(entry);
        }
        return results;
    }
    /**
     * Reads the content of a file on device.
     *
     * @param filename The full path of the file on device to read.
     * @returns A `ReadableStream` that contains the file content.
     */
    read(filename) {
        return adbSyncPull(this._socket, filename);
    }
    /**
     * Writes a file on device. If the file name already exists, it will be overwritten.
     *
     * @param options The content and options of the file to write.
     */
    async write(options) {
        if (this.needPushMkdirWorkaround) {
            // It may fail if `filename` already exists.
            // Ignore the result.
            // TODO: sync: test push mkdir workaround (need an Android 8 device)
            await this._adb.subprocess.noneProtocol.spawnWait([
                "mkdir",
                "-p",
                escapeArg(dirname(options.filename)),
            ]);
        }
        await adbSyncPush({
            v2: this.supportsSendReceiveV2,
            socket: this._socket,
            ...options,
        });
    }
    lockSocket() {
        return this._socket.lock();
    }
    dispose() {
        return this._socket.close();
    }
}
//# sourceMappingURL=sync.js.map