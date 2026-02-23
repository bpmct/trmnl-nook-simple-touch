import { BufferedReadableStream } from "@yume-chan/stream-extra";
import { buffer, struct, StructEmptyError, u32 } from "@yume-chan/struct";
const Version = struct({ version: u32 }, { littleEndian: true });
export const AdbFrameBufferV1 = struct({
    bpp: u32,
    size: u32,
    width: u32,
    height: u32,
    red_offset: u32,
    red_length: u32,
    blue_offset: u32,
    blue_length: u32,
    green_offset: u32,
    green_length: u32,
    alpha_offset: u32,
    alpha_length: u32,
    data: buffer("size"),
}, { littleEndian: true });
export const AdbFrameBufferV2 = struct({
    bpp: u32,
    colorSpace: u32,
    size: u32,
    width: u32,
    height: u32,
    red_offset: u32,
    red_length: u32,
    blue_offset: u32,
    blue_length: u32,
    green_offset: u32,
    green_length: u32,
    alpha_offset: u32,
    alpha_length: u32,
    data: buffer("size"),
}, { littleEndian: true });
export class AdbFrameBufferError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
export class AdbFrameBufferUnsupportedVersionError extends AdbFrameBufferError {
    constructor(version) {
        super(`Unsupported FrameBuffer version ${version}`);
    }
}
export class AdbFrameBufferForbiddenError extends AdbFrameBufferError {
    constructor() {
        super("FrameBuffer is disabled by current app");
    }
}
export async function framebuffer(adb) {
    const socket = await adb.createSocket("framebuffer:");
    const stream = new BufferedReadableStream(socket.readable);
    let version;
    try {
        ({ version } = await Version.deserialize(stream));
    }
    catch (e) {
        if (e instanceof StructEmptyError) {
            throw new AdbFrameBufferForbiddenError();
        }
        throw e;
    }
    switch (version) {
        case 1:
            // TODO: AdbFrameBuffer: does all v1 responses uses the same color space? Add it so the command returns same format for all versions.
            return await AdbFrameBufferV1.deserialize(stream);
        case 2:
            return await AdbFrameBufferV2.deserialize(stream);
        default:
            throw new AdbFrameBufferUnsupportedVersionError(version);
    }
}
//# sourceMappingURL=framebuffer.js.map