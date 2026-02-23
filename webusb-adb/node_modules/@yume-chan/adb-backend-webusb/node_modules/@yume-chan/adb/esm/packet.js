import { ConsumableTransformStream } from "@yume-chan/stream-extra";
import Struct from "@yume-chan/struct";
export var AdbCommand;
(function (AdbCommand) {
    AdbCommand[AdbCommand["Auth"] = 1213486401] = "Auth";
    AdbCommand[AdbCommand["Close"] = 1163086915] = "Close";
    AdbCommand[AdbCommand["Connect"] = 1314410051] = "Connect";
    AdbCommand[AdbCommand["OK"] = 1497451343] = "OK";
    AdbCommand[AdbCommand["Open"] = 1313165391] = "Open";
    AdbCommand[AdbCommand["Write"] = 1163154007] = "Write";
})(AdbCommand = AdbCommand || (AdbCommand = {}));
export const AdbPacketHeader = new Struct({ littleEndian: true })
    .uint32("command")
    .uint32("arg0")
    .uint32("arg1")
    .uint32("payloadLength")
    .uint32("checksum")
    .int32("magic");
export const AdbPacket = new Struct({ littleEndian: true })
    .fields(AdbPacketHeader)
    .uint8Array("payload", { lengthField: "payloadLength" });
export function calculateChecksum(payload) {
    return payload.reduce((result, item) => result + item, 0);
}
export class AdbPacketSerializeStream extends ConsumableTransformStream {
    constructor() {
        const headerBuffer = new Uint8Array(AdbPacketHeader.size);
        super({
            transform: async (chunk, controller) => {
                const init = chunk;
                init.payloadLength = init.payload.byteLength;
                AdbPacketHeader.serialize(init, headerBuffer);
                await controller.enqueue(headerBuffer);
                if (init.payload.byteLength) {
                    // USB protocol preserves packet boundaries,
                    // so we must write payload separately as native ADB does,
                    // otherwise the read operation on device will fail.
                    await controller.enqueue(init.payload);
                }
            },
        });
    }
}
//# sourceMappingURL=packet.js.map