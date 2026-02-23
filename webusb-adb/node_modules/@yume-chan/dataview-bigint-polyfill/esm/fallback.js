import { getBigInt64 as fallbackGetBigInt64, getBigUint64 as fallbackGetBigUint64, setBigInt64 as fallbackSetBigInt64, setBigUint64 as fallbackSetBigUint64, } from "./pure.js";
export const getBigInt64 = "getBigInt64" in DataView.prototype
    ? (dataView, byteOffset, littleEndian) => dataView.getBigInt64(byteOffset, littleEndian)
    : fallbackGetBigInt64;
export const getBigUint64 = "getBigUint64" in DataView.prototype
    ? (dataView, byteOffset, littleEndian) => dataView.getBigUint64(byteOffset, littleEndian)
    : fallbackGetBigUint64;
export const setBigInt64 = "setBigInt64" in DataView.prototype
    ? (dataView, byteOffset, value, littleEndian) => dataView.setBigInt64(byteOffset, value, littleEndian)
    : fallbackSetBigInt64;
export const setBigUint64 = "setBigUint64" in DataView.prototype
    ? (dataView, byteOffset, value, littleEndian) => dataView.setBigUint64(byteOffset, value, littleEndian)
    : fallbackSetBigUint64;
//# sourceMappingURL=fallback.js.map