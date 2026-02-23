import { ConsumableTransformStream } from "@yume-chan/stream-extra";
import Struct from "@yume-chan/struct";
export declare enum AdbCommand {
    Auth = 1213486401,
    Close = 1163086915,
    Connect = 1314410051,
    OK = 1497451343,
    Open = 1313165391,
    Write = 1163154007
}
export declare const AdbPacketHeader: Struct<{
    command: number;
    arg0: number;
    arg1: number;
    payloadLength: number;
    checksum: number;
    magic: number;
}, never, Record<never, never>, undefined>;
export type AdbPacketHeader = (typeof AdbPacketHeader)["TDeserializeResult"];
export declare const AdbPacket: Struct<{
    command: number;
    arg0: number;
    arg1: number;
    payloadLength: number;
    checksum: number;
    magic: number;
    payload: Uint8Array;
}, "payloadLength", Record<never, never>, undefined>;
export type AdbPacket = (typeof AdbPacket)["TDeserializeResult"];
/**
 * `AdbPacketData` contains all the useful fields of `AdbPacket`.
 *
 * `AdbBackend#connect` will return a `ReadableStream<AdbPacketData>`,
 * so each backend can encode `AdbPacket` in different ways.
 *
 * `AdbBackend#connect` will return a `WritableStream<AdbPacketInit>`,
 * however, `AdbPacketDispatcher` will transform `AdbPacketData` to `AdbPacketInit` for you,
 * so `AdbSocket#writable#write` only needs `AdbPacketData`.
 */
export type AdbPacketData = Omit<(typeof AdbPacket)["TInit"], "checksum" | "magic">;
export type AdbPacketInit = (typeof AdbPacket)["TInit"];
export declare function calculateChecksum(payload: Uint8Array): number;
export declare class AdbPacketSerializeStream extends ConsumableTransformStream<AdbPacketInit, Uint8Array> {
    constructor();
}
//# sourceMappingURL=packet.d.ts.map