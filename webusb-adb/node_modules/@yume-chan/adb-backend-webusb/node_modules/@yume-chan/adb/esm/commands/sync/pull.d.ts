import type { ReadableStream } from "@yume-chan/stream-extra";
import Struct from "@yume-chan/struct";
import { AdbSyncResponseId } from "./response.js";
import type { AdbSyncSocket } from "./socket.js";
export declare const AdbSyncDataResponse: Struct<{
    dataLength: number;
    data: Uint8Array;
}, "dataLength", {
    id: AdbSyncResponseId.Data;
}, undefined>;
export type AdbSyncDataResponse = (typeof AdbSyncDataResponse)["TDeserializeResult"];
export declare function adbSyncPullGenerator(socket: AdbSyncSocket, path: string): AsyncGenerator<Uint8Array, void, void>;
export declare function adbSyncPull(socket: AdbSyncSocket, path: string): ReadableStream<Uint8Array>;
//# sourceMappingURL=pull.d.ts.map