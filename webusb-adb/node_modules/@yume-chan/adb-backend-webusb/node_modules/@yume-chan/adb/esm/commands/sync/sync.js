import { AutoDisposable } from "@yume-chan/event";
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
export class AdbSync extends AutoDisposable {
    _adb;
    _socket;
    _supportsStat;
    _supportsListV2;
    _fixedPushMkdir;
    _supportsSendReceiveV2;
    _needPushMkdirWorkaround;
    get supportsStat() {
        return this._supportsStat;
    }
    get supportsListV2() {
        return this._supportsListV2;
    }
    get fixedPushMkdir() {
        return this._fixedPushMkdir;
    }
    get supportsSendReceiveV2() {
        return this._supportsSendReceiveV2;
    }
    get needPushMkdirWorkaround() {
        return this._needPushMkdirWorkaround;
    }
    constructor(adb, socket) {
        super();
        this._adb = adb;
        this._socket = new AdbSyncSocket(socket, adb.maxPayloadSize);
        this._supportsStat = adb.supportsFeature(AdbFeature.StatV2);
        this._supportsListV2 = adb.supportsFeature(AdbFeature.ListV2);
        this._fixedPushMkdir = adb.supportsFeature(AdbFeature.FixedPushMkdir);
        this._supportsSendReceiveV2 = adb.supportsFeature(AdbFeature.SendReceiveV2);
        // https://android.googlesource.com/platform/packages/modules/adb/+/91768a57b7138166e0a3d11f79cd55909dda7014/client/file_sync_client.cpp#1361
        this._needPushMkdirWorkaround =
            this._adb.supportsFeature(AdbFeature.ShellV2) &&
                !this.fixedPushMkdir;
    }
    async lstat(path) {
        return await adbSyncLstat(this._socket, path, this.supportsStat);
    }
    async stat(path) {
        if (!this.supportsStat) {
            throw new Error("Not supported");
        }
        return await adbSyncStat(this._socket, path);
    }
    async isDirectory(path) {
        try {
            await this.lstat(path + "/");
            return true;
        }
        catch (e) {
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
     * Read the content of a file on device.
     *
     * @param filename The full path of the file on device to read.
     * @returns A `ReadableStream` that reads from the file.
     */
    read(filename) {
        return adbSyncPull(this._socket, filename);
    }
    /**
     * Write (or overwrite) a file on device.
     *
     * @param filename The full path of the file on device to write.
     * @param file The content to write.
     * @param mode The unix permissions of the file.
     * @param mtime The modified time of the file.
     * @returns A `WritableStream` that writes to the file.
     */
    async write(options) {
        if (this.needPushMkdirWorkaround) {
            // It may fail if the path is already existed.
            // Ignore the result.
            // TODO: sync: test push mkdir workaround (need an Android 8 device)
            await this._adb.subprocess.spawnAndWait([
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
    async dispose() {
        super.dispose();
        await this._socket.close();
    }
}
//# sourceMappingURL=sync.js.map