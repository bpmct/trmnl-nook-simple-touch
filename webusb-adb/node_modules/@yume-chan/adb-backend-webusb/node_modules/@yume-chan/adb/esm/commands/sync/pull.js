import { PushReadableStream } from "@yume-chan/stream-extra";
import Struct from "@yume-chan/struct";
import { AdbSyncRequestId, adbSyncWriteRequest } from "./request.js";
import { AdbSyncResponseId, adbSyncReadResponses } from "./response.js";
export const AdbSyncDataResponse = new Struct({ littleEndian: true })
    .uint32("dataLength")
    .uint8Array("data", { lengthField: "dataLength" })
    .extra({ id: AdbSyncResponseId.Data });
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
    return new PushReadableStream(async (controller) => {
        for await (const data of adbSyncPullGenerator(socket, path)) {
            await controller.enqueue(data);
        }
    });
}
//# sourceMappingURL=pull.js.map