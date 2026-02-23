import Struct from "@yume-chan/struct";
import { decodeUtf8 } from "../../utils/index.js";
export var AdbSyncResponseId;
(function (AdbSyncResponseId) {
    AdbSyncResponseId["Entry"] = "DENT";
    AdbSyncResponseId["Entry2"] = "DNT2";
    AdbSyncResponseId["Lstat"] = "STAT";
    AdbSyncResponseId["Stat"] = "STA2";
    AdbSyncResponseId["Lstat2"] = "LST2";
    AdbSyncResponseId["Done"] = "DONE";
    AdbSyncResponseId["Data"] = "DATA";
    AdbSyncResponseId["Ok"] = "OKAY";
    AdbSyncResponseId["Fail"] = "FAIL";
})(AdbSyncResponseId = AdbSyncResponseId || (AdbSyncResponseId = {}));
export const AdbSyncFailResponse = new Struct({ littleEndian: true })
    .uint32("messageLength")
    .string("message", { lengthField: "messageLength" })
    .postDeserialize((object) => {
    throw new Error(object.message);
});
export async function adbSyncReadResponse(stream, id, type) {
    const actualId = decodeUtf8(await stream.read(4));
    switch (actualId) {
        case AdbSyncResponseId.Fail:
            await AdbSyncFailResponse.deserialize(stream);
            throw new Error("Unreachable");
        case id:
            return await type.deserialize(stream);
        default:
            throw new Error(`Expected '${id}', but got '${actualId}'`);
    }
}
export async function* adbSyncReadResponses(stream, id, type) {
    while (true) {
        const actualId = decodeUtf8(await stream.read(4));
        switch (actualId) {
            case AdbSyncResponseId.Fail:
                await AdbSyncFailResponse.deserialize(stream);
                throw new Error("Unreachable");
            case AdbSyncResponseId.Done:
                // `DONE` responses' size are always same as the request's normal response.
                //
                // For example, `DONE` responses for `LIST` requests are 16 bytes (same as `DENT` responses),
                // but `DONE` responses for `STAT` requests are 12 bytes (same as `STAT` responses).
                await stream.read(type.size);
                return;
            case id:
                yield await type.deserialize(stream);
                break;
            default:
                throw new Error(`Expected '${id}' or '${AdbSyncResponseId.Done}', but got '${actualId}'`);
        }
    }
}
//# sourceMappingURL=response.js.map