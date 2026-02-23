import { BufferedReadableStream } from "@yume-chan/stream-extra";
import Struct from "@yume-chan/struct";
const Version = new Struct({ littleEndian: true }).uint32("version");
export const AdbFrameBufferV1 = new Struct({ littleEndian: true })
    .uint32("bpp")
    .uint32("size")
    .uint32("width")
    .uint32("height")
    .uint32("red_offset")
    .uint32("red_length")
    .uint32("blue_offset")
    .uint32("blue_length")
    .uint32("green_offset")
    .uint32("green_length")
    .uint32("alpha_offset")
    .uint32("alpha_length")
    .uint8Array("data", { lengthField: "size" });
export const AdbFrameBufferV2 = new Struct({ littleEndian: true })
    .uint32("bpp")
    .uint32("colorSpace")
    .uint32("size")
    .uint32("width")
    .uint32("height")
    .uint32("red_offset")
    .uint32("red_length")
    .uint32("blue_offset")
    .uint32("blue_length")
    .uint32("green_offset")
    .uint32("green_length")
    .uint32("alpha_offset")
    .uint32("alpha_length")
    .uint8Array("data", { lengthField: "size" });
export async function framebuffer(adb) {
    const socket = await adb.createSocket("framebuffer:");
    const stream = new BufferedReadableStream(socket.readable);
    const { version } = await Version.deserialize(stream);
    switch (version) {
        case 1:
            // TODO: AdbFrameBuffer: does all v1 responses uses the same color space? Add it so the command returns same format for all versions.
            return AdbFrameBufferV1.deserialize(stream);
        case 2:
            return AdbFrameBufferV2.deserialize(stream);
        default:
            throw new Error("Unsupported FrameBuffer version");
    }
}
//# sourceMappingURL=framebuffer.js.map