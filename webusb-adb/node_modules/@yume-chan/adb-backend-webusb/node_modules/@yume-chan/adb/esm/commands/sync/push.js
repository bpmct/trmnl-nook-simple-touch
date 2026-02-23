import { AbortController, ConsumableWritableStream, DistributionStream, } from "@yume-chan/stream-extra";
import Struct, { placeholder } from "@yume-chan/struct";
import { AdbSyncRequestId, adbSyncWriteRequest } from "./request.js";
import { AdbSyncResponseId, adbSyncReadResponse } from "./response.js";
import { LinuxFileType } from "./stat.js";
const NOOP = () => {
    // no-op
};
export const ADB_SYNC_MAX_PACKET_SIZE = 64 * 1024;
export const AdbSyncOkResponse = new Struct({ littleEndian: true }).uint32("unused");
async function pipeFile(locked, file, packetSize, mtime) {
    // Read and write in parallel,
    // allow error response to abort the write.
    const abortController = new AbortController();
    file.pipeThrough(new DistributionStream(packetSize, true))
        .pipeTo(new ConsumableWritableStream({
        write: async (chunk) => {
            await adbSyncWriteRequest(locked, AdbSyncRequestId.Data, chunk);
        },
    }), { signal: abortController.signal })
        .then(async () => {
        await adbSyncWriteRequest(locked, AdbSyncRequestId.Done, mtime);
        await locked.flush();
    }, NOOP);
    await adbSyncReadResponse(locked, AdbSyncResponseId.Ok, AdbSyncOkResponse).catch((e) => {
        abortController.abort();
        throw e;
    });
}
export async function adbSyncPushV1({ socket, filename, file, mode = (LinuxFileType.File << 12) | 0o666, mtime = (Date.now() / 1000) | 0, packetSize = ADB_SYNC_MAX_PACKET_SIZE, }) {
    const locked = await socket.lock();
    try {
        const pathAndMode = `${filename},${mode.toString()}`;
        await adbSyncWriteRequest(locked, AdbSyncRequestId.Send, pathAndMode);
        await pipeFile(locked, file, packetSize, mtime);
    }
    finally {
        locked.release();
    }
}
export var AdbSyncSendV2Flags;
(function (AdbSyncSendV2Flags) {
    AdbSyncSendV2Flags[AdbSyncSendV2Flags["None"] = 0] = "None";
    AdbSyncSendV2Flags[AdbSyncSendV2Flags["Brotli"] = 1] = "Brotli";
    /**
     * 2
     */
    AdbSyncSendV2Flags[AdbSyncSendV2Flags["Lz4"] = 2] = "Lz4";
    /**
     * 4
     */
    AdbSyncSendV2Flags[AdbSyncSendV2Flags["Zstd"] = 4] = "Zstd";
    /**
     * 0x80000000
     */
    AdbSyncSendV2Flags[AdbSyncSendV2Flags["DryRun"] = 2147483648] = "DryRun";
})(AdbSyncSendV2Flags = AdbSyncSendV2Flags || (AdbSyncSendV2Flags = {}));
export const AdbSyncSendV2Request = new Struct({ littleEndian: true })
    .uint32("id", placeholder())
    .uint32("mode")
    .uint32("flags", placeholder());
export async function adbSyncPushV2({ socket, filename, file, mode = (LinuxFileType.File << 12) | 0o666, mtime = (Date.now() / 1000) | 0, packetSize = ADB_SYNC_MAX_PACKET_SIZE, dryRun = false, }) {
    const locked = await socket.lock();
    try {
        await adbSyncWriteRequest(locked, AdbSyncRequestId.SendV2, filename);
        let flags = AdbSyncSendV2Flags.None;
        if (dryRun) {
            flags |= AdbSyncSendV2Flags.DryRun;
        }
        await locked.write(AdbSyncSendV2Request.serialize({
            id: AdbSyncRequestId.SendV2,
            mode,
            flags,
        }));
        await pipeFile(locked, file, packetSize, mtime);
    }
    finally {
        locked.release();
    }
}
export function adbSyncPush(options) {
    if (options.v2) {
        return adbSyncPushV2(options);
    }
    if (options.dryRun) {
        throw new Error("dryRun is not supported in v1");
    }
    return adbSyncPushV1(options);
}
//# sourceMappingURL=push.js.map