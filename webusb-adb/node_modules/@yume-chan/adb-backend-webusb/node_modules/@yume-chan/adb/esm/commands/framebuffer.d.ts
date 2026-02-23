import Struct from "@yume-chan/struct";
import type { Adb } from "../adb.js";
export declare const AdbFrameBufferV1: Struct<{
    bpp: number;
    size: number;
    width: number;
    height: number;
    red_offset: number;
    red_length: number;
    blue_offset: number;
    blue_length: number;
    green_offset: number;
    green_length: number;
    alpha_offset: number;
    alpha_length: number;
    data: Uint8Array;
}, "size", Record<never, never>, undefined>;
export type AdbFrameBufferV1 = (typeof AdbFrameBufferV1)["TDeserializeResult"];
export declare const AdbFrameBufferV2: Struct<{
    bpp: number;
    colorSpace: number;
    size: number;
    width: number;
    height: number;
    red_offset: number;
    red_length: number;
    blue_offset: number;
    blue_length: number;
    green_offset: number;
    green_length: number;
    alpha_offset: number;
    alpha_length: number;
    data: Uint8Array;
}, "size", Record<never, never>, undefined>;
export type AdbFrameBufferV2 = (typeof AdbFrameBufferV2)["TDeserializeResult"];
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
export declare function framebuffer(adb: Adb): Promise<AdbFrameBuffer>;
//# sourceMappingURL=framebuffer.d.ts.map