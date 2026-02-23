import { ReadableStream } from "@yume-chan/stream-extra";
import type { StructValue } from "@yume-chan/struct";
import type { AdbSyncSocket } from "./socket.js";
export declare const AdbSyncDataResponse: import("@yume-chan/struct").Struct<{
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, string, never, Uint8Array<ArrayBufferLike>>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, string, never, Uint8Array<ArrayBufferLike>>;
}>>;
export type AdbSyncDataResponse = StructValue<typeof AdbSyncDataResponse>;
export declare function adbSyncPullGenerator(socket: AdbSyncSocket, path: string): AsyncGenerator<Uint8Array, void, void>;
export declare function adbSyncPull(socket: AdbSyncSocket, path: string): ReadableStream<Uint8Array>;
//# sourceMappingURL=pull.d.ts.map