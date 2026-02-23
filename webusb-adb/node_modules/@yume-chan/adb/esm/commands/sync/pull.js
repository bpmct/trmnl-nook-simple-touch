import { ReadableStream } from "@yume-chan/stream-extra";
import { buffer, struct, u32 } from "@yume-chan/struct";
import { AdbSyncRequestId, adbSyncWriteRequest } from "./request.js";
import { adbSyncReadResponses, AdbSyncResponseId } from "./response.js";
export const AdbSyncDataResponse = struct({ data: buffer(u32) }, { littleEndian: true });
export async function* adbSyncPullGenerator(socket, path) {
    const locked = await socket.lock();
    let done = false;
    try {
        await adbSyncWriteRequest(locked, AdbSyncRequestId.Receive, path);
        for await (const packet of adbSyncReadResponses(locked, AdbSyncResponseId.Data, AdbSyncDataResponse)) {
            yield packet.data;
        }
        done = true;
    }
    catch (e) {
        done = true;
        throw e;
    }
    finally {
        if (!done) {
            // sync pull can't be cancelled, so we have to read all data
            for await (const packet of adbSyncReadResponses(locked, AdbSyncResponseId.Data, AdbSyncDataResponse)) {
                void packet;
            }
        }
        locked.release();
    }
}
export function adbSyncPull(socket, path) {
    return ReadableStream.from(adbSyncPullGenerator(socket, path));
}
//# sourceMappingURL=pull.js.map