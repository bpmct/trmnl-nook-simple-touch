import { extend, string, u32 } from "@yume-chan/struct";
import { AdbSyncRequestId, adbSyncWriteRequest } from "./request.js";
import { AdbSyncResponseId, adbSyncReadResponses } from "./response.js";
import { AdbSyncLstatResponse, AdbSyncStatErrorCode, AdbSyncStatResponse, } from "./stat.js";
export const AdbSyncEntryResponse = extend(AdbSyncLstatResponse, {
    name: string(u32),
});
export const AdbSyncEntry2Response = extend(AdbSyncStatResponse, {
    name: string(u32),
});
export async function* adbSyncOpenDirV2(socket, path) {
    const locked = await socket.lock();
    try {
        await adbSyncWriteRequest(locked, AdbSyncRequestId.ListV2, path);
        for await (const item of adbSyncReadResponses(locked, AdbSyncResponseId.Entry2, AdbSyncEntry2Response)) {
            // `LST2` can return error codes for failed `lstat` calls.
            // `LIST` just ignores them.
            // But they only contain `name` so still pretty useless.
            if (item.error !== AdbSyncStatErrorCode.SUCCESS) {
                continue;
            }
            yield item;
        }
    }
    finally {
        locked.release();
    }
}
export async function* adbSyncOpenDirV1(socket, path) {
    const locked = await socket.lock();
    try {
        await adbSyncWriteRequest(locked, AdbSyncRequestId.List, path);
        for await (const item of adbSyncReadResponses(locked, AdbSyncResponseId.Entry, AdbSyncEntryResponse)) {
            yield item;
        }
    }
    finally {
        locked.release();
    }
}
export async function* adbSyncOpenDir(socket, path, v2) {
    if (v2) {
        yield* adbSyncOpenDirV2(socket, path);
    }
    else {
        for await (const item of adbSyncOpenDirV1(socket, path)) {
            // Convert to same format as `AdbSyncEntry2Response` for easier consumption.
            // However it will add some overhead.
            yield {
                mode: item.mode,
                size: BigInt(item.size),
                mtime: BigInt(item.mtime),
                get type() {
                    return item.type;
                },
                get permission() {
                    return item.permission;
                },
                name: item.name,
            };
        }
    }
}
//# sourceMappingURL=list.js.map