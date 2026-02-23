import { Consumable, TransformStream } from "@yume-chan/stream-extra";
import { buffer, extend, s32, struct, u32 } from "@yume-chan/struct";
export const AdbCommand = {
    Auth: 0x48545541, // 'AUTH'
    Close: 0x45534c43, // 'CLSE'
    Connect: 0x4e584e43, // 'CNXN'
    Okay: 0x59414b4f, // 'OKAY'
    Open: 0x4e45504f, // 'OPEN'
    Write: 0x45545257, // 'WRTE'
};
export const AdbPacketHeader = struct({
    command: u32,
    arg0: u32,
    arg1: u32,
    payloadLength: u32,
    checksum: u32,
    magic: s32,
}, { littleEndian: true });
export const AdbPacket = extend(AdbPacketHeader, {
    payload: buffer("payloadLength"),
});
export function calculateChecksum(payload) {
    return payload.reduce((result, item) => result + item, 0);
}
export class AdbPacketSerializeStream extends TransformStream {
    constructor() {
        const headerBuffer = new Uint8Array(AdbPacketHeader.size);
        super({
            transform: async (chunk, controller) => {
                await chunk.tryConsume(async (chunk) => {
                    const init = chunk;
                    init.payloadLength = init.payload.length;
                    AdbPacketHeader.serialize(init, headerBuffer);
                    await Consumable.ReadableStream.enqueue(controller, headerBuffer);
                    if (init.payloadLength) {
                        // USB protocol preserves packet boundaries,
                        // so we must write payload separately as native ADB does,
                        // otherwise the read operation on device will fail.
                        await Consumable.ReadableStream.enqueue(controller, init.payload);
                    }
                });
            },
        });
    }
}
//# sourceMappingURL=packet.js.map