import type { StructValue } from "@yume-chan/struct";
import type { Adb } from "../adb.js";
export declare const AdbFrameBufferV1: import("@yume-chan/struct").Struct<{
    bpp: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    width: import("@yume-chan/struct").NumberField<number>;
    height: import("@yume-chan/struct").NumberField<number>;
    red_offset: import("@yume-chan/struct").NumberField<number>;
    red_length: import("@yume-chan/struct").NumberField<number>;
    blue_offset: import("@yume-chan/struct").NumberField<number>;
    blue_length: import("@yume-chan/struct").NumberField<number>;
    green_offset: import("@yume-chan/struct").NumberField<number>;
    green_length: import("@yume-chan/struct").NumberField<number>;
    alpha_offset: import("@yume-chan/struct").NumberField<number>;
    alpha_length: import("@yume-chan/struct").NumberField<number>;
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, "size", Record<"size", number>, Uint8Array<ArrayBufferLike>>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    bpp: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    width: import("@yume-chan/struct").NumberField<number>;
    height: import("@yume-chan/struct").NumberField<number>;
    red_offset: import("@yume-chan/struct").NumberField<number>;
    red_length: import("@yume-chan/struct").NumberField<number>;
    blue_offset: import("@yume-chan/struct").NumberField<number>;
    blue_length: import("@yume-chan/struct").NumberField<number>;
    green_offset: import("@yume-chan/struct").NumberField<number>;
    green_length: import("@yume-chan/struct").NumberField<number>;
    alpha_offset: import("@yume-chan/struct").NumberField<number>;
    alpha_length: import("@yume-chan/struct").NumberField<number>;
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, "size", Record<"size", number>, Uint8Array<ArrayBufferLike>>;
}>>;
export type AdbFrameBufferV1 = StructValue<typeof AdbFrameBufferV1>;
export declare const AdbFrameBufferV2: import("@yume-chan/struct").Struct<{
    bpp: import("@yume-chan/struct").NumberField<number>;
    colorSpace: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    width: import("@yume-chan/struct").NumberField<number>;
    height: import("@yume-chan/struct").NumberField<number>;
    red_offset: import("@yume-chan/struct").NumberField<number>;
    red_length: import("@yume-chan/struct").NumberField<number>;
    blue_offset: import("@yume-chan/struct").NumberField<number>;
    blue_length: import("@yume-chan/struct").NumberField<number>;
    green_offset: import("@yume-chan/struct").NumberField<number>;
    green_length: import("@yume-chan/struct").NumberField<number>;
    alpha_offset: import("@yume-chan/struct").NumberField<number>;
    alpha_length: import("@yume-chan/struct").NumberField<number>;
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, "size", Record<"size", number>, Uint8Array<ArrayBufferLike>>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    bpp: import("@yume-chan/struct").NumberField<number>;
    colorSpace: import("@yume-chan/struct").NumberField<number>;
    size: import("@yume-chan/struct").NumberField<number>;
    width: import("@yume-chan/struct").NumberField<number>;
    height: import("@yume-chan/struct").NumberField<number>;
    red_offset: import("@yume-chan/struct").NumberField<number>;
    red_length: import("@yume-chan/struct").NumberField<number>;
    blue_offset: import("@yume-chan/struct").NumberField<number>;
    blue_length: import("@yume-chan/struct").NumberField<number>;
    green_offset: import("@yume-chan/struct").NumberField<number>;
    green_length: import("@yume-chan/struct").NumberField<number>;
    alpha_offset: import("@yume-chan/struct").NumberField<number>;
    alpha_length: import("@yume-chan/struct").NumberField<number>;
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, "size", Record<"size", number>, Uint8Array<ArrayBufferLike>>;
}>>;
export type AdbFrameBufferV2 = StructValue<typeof AdbFrameBufferV2>;
/**
 * ADB uses 8 int32 fields to describe bit depths
 *
 * The only combination I have seen is RGBA8888, which is
 *
 *   red_offset:   0
 *   red_length:   8
 *   blue_offset:  16
 *   blue_length:  8
 *   green_offset: 8
 *   green_length: 8
 *   alpha_offset: 24
 *   alpha_length: 8
 *
 * But it doesn't mean that other combinations are not possible.
 */
export type AdbFrameBuffer = AdbFrameBufferV1 | AdbFrameBufferV2;
export declare abstract class AdbFrameBufferError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class AdbFrameBufferUnsupportedVersionError extends AdbFrameBufferError {
    constructor(version: number);
}
export declare class AdbFrameBufferForbiddenError extends AdbFrameBufferError {
    constructor();
}
export declare function framebuffer(adb: Adb): Promise<AdbFrameBuffer>;
//# sourceMappingURL=framebuffer.d.ts.map