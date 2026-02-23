import { Consumable, TransformStream } from "@yume-chan/stream-extra";
import type { StructInit, StructValue } from "@yume-chan/struct";
export declare const AdbCommand: {
    readonly Auth: 1213486401;
    readonly Close: 1163086915;
    readonly Connect: 1314410051;
    readonly Okay: 1497451343;
    readonly Open: 1313165391;
    readonly Write: 1163154007;
};
export type AdbCommand = (typeof AdbCommand)[keyof typeof AdbCommand];
export declare const AdbPacketHeader: import("@yume-chan/struct").Struct<{
    command: import("@yume-chan/struct").NumberField<number>;
    arg0: import("@yume-chan/struct").NumberField<number>;
    arg1: import("@yume-chan/struct").NumberField<number>;
    payloadLength: import("@yume-chan/struct").NumberField<number>;
    checksum: import("@yume-chan/struct").NumberField<number>;
    magic: import("@yume-chan/struct").NumberField<number>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    command: import("@yume-chan/struct").NumberField<number>;
    arg0: import("@yume-chan/struct").NumberField<number>;
    arg1: import("@yume-chan/struct").NumberField<number>;
    payloadLength: import("@yume-chan/struct").NumberField<number>;
    checksum: import("@yume-chan/struct").NumberField<number>;
    magic: import("@yume-chan/struct").NumberField<number>;
}>>;
export type AdbPacketHeader = StructValue<typeof AdbPacketHeader>;
export declare const AdbPacket: import("@yume-chan/struct").Struct<{
    command: import("@yume-chan/struct").NumberField<number>;
    arg0: import("@yume-chan/struct").NumberField<number>;
    arg1: import("@yume-chan/struct").NumberField<number>;
    payloadLength: import("@yume-chan/struct").NumberField<number>;
    checksum: import("@yume-chan/struct").NumberField<number>;
    magic: import("@yume-chan/struct").NumberField<number>;
} & {
    payload: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, "payloadLength", Record<"payloadLength", number>, Uint8Array<ArrayBufferLike>>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    command: import("@yume-chan/struct").NumberField<number>;
    arg0: import("@yume-chan/struct").NumberField<number>;
    arg1: import("@yume-chan/struct").NumberField<number>;
    payloadLength: import("@yume-chan/struct").NumberField<number>;
    checksum: import("@yume-chan/struct").NumberField<number>;
    magic: import("@yume-chan/struct").NumberField<number>;
} & {
    payload: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, "payloadLength", Record<"payloadLength", number>, Uint8Array<ArrayBufferLike>>;
}>>;
export type AdbPacket = StructValue<typeof AdbPacket>;
/**
 * `AdbPacketData` contains all the useful fields of `AdbPacket`.
 *
 * `AdvDaemonConnection#connect` will return a `ReadableStream<AdbPacketData>`,
 * allow each connection to encode `AdbPacket` in different methods.
 *
 * `AdbDaemonConnection#connect` will return a `WritableStream<AdbPacketInit>`,
 * however, `AdbDaemonTransport` will transform `AdbPacketData` to `AdbPacketInit` for you,
 * so `AdbSocket#writable#write` only needs `AdbPacketData`.
 */
export type AdbPacketData = Omit<StructInit<typeof AdbPacket>, "checksum" | "magic">;
export type AdbPacketInit = StructInit<typeof AdbPacket>;
export declare function calculateChecksum(payload: Uint8Array): number;
export declare class AdbPacketSerializeStream extends TransformStream<Consumable<AdbPacketInit>, Consumable<Uint8Array>> {
    constructor();
}
//# sourceMappingURL=packet.d.ts.map