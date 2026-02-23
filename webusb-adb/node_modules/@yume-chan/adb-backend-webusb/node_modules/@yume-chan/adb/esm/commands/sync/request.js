import Struct from "@yume-chan/struct";
import { encodeUtf8 } from "../../utils/index.js";
export var AdbSyncRequestId;
(function (AdbSyncRequestId) {
    AdbSyncRequestId["List"] = "LIST";
    AdbSyncRequestId["ListV2"] = "LIS2";
    AdbSyncRequestId["Send"] = "SEND";
    AdbSyncRequestId["SendV2"] = "SND2";
    AdbSyncRequestId["Lstat"] = "STAT";
    AdbSyncRequestId["Stat"] = "STA2";
    AdbSyncRequestId["LstatV2"] = "LST2";
    AdbSyncRequestId["Data"] = "DATA";
    AdbSyncRequestId["Done"] = "DONE";
    AdbSyncRequestId["Receive"] = "RECV";
})(AdbSyncRequestId = AdbSyncRequestId || (AdbSyncRequestId = {}));
export const AdbSyncNumberRequest = new Struct({ littleEndian: true })
    .string("id", { length: 4 })
    .uint32("arg");
export const AdbSyncDataRequest = new Struct({ littleEndian: true })
    .fields(AdbSyncNumberRequest)
    .uint8Array("data", { lengthField: "arg" });
export async function adbSyncWriteRequest(writable, id, value) {
    if (typeof value === "number") {
        const buffer = AdbSyncNumberRequest.serialize({
            id,
            arg: value,
        });
        await writable.write(buffer);
    }
    else if (typeof value === "string") {
        // Let `writable` buffer writes
        const buffer = encodeUtf8(value);
        await writable.write(AdbSyncNumberRequest.serialize({ id, arg: buffer.byteLength }));
        await writable.write(buffer);
    }
    else {
        await writable.write(AdbSyncNumberRequest.serialize({ id, arg: value.byteLength }));
        await writable.write(value);
    }
}
//# sourceMappingURL=request.js.map