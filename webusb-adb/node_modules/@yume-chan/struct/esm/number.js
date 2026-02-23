import { getInt16, getInt32, getInt64, getInt8, getUint16, getUint32, getUint64, setInt16, setInt32, setInt64, setUint16, setUint32, setUint64, } from "@yume-chan/no-data-view";
import { field } from "./field/index.js";
/* #__NO_SIDE_EFFECTS__ */
function number(size, serialize, deserialize) {
    const fn = (() => fn);
    Object.assign(fn, field(size, "byob", serialize, deserialize));
    return fn;
}
export const u8 = number(1, (value, { buffer, index }) => {
    buffer[index] = value;
}, function* (then, reader) {
    const data = yield* then(reader.readExactly(1));
    return data[0];
});
export const s8 = number(1, (value, { buffer, index }) => {
    buffer[index] = value;
}, function* (then, reader) {
    const data = yield* then(reader.readExactly(1));
    return getInt8(data, 0);
});
export const u16 = number(2, (value, { buffer, index, littleEndian }) => {
    setUint16(buffer, index, value, littleEndian);
}, function* (then, reader, { littleEndian }) {
    const data = yield* then(reader.readExactly(2));
    return getUint16(data, 0, littleEndian);
});
export const s16 = number(2, (value, { buffer, index, littleEndian }) => {
    setInt16(buffer, index, value, littleEndian);
}, function* (then, reader, { littleEndian }) {
    const data = yield* then(reader.readExactly(2));
    return getInt16(data, 0, littleEndian);
});
export const u32 = number(4, (value, { buffer, index, littleEndian }) => {
    setUint32(buffer, index, value, littleEndian);
}, function* (then, reader, { littleEndian }) {
    const data = yield* then(reader.readExactly(4));
    return getUint32(data, 0, littleEndian);
});
export const s32 = number(4, (value, { buffer, index, littleEndian }) => {
    setInt32(buffer, index, value, littleEndian);
}, function* (then, reader, { littleEndian }) {
    const data = yield* then(reader.readExactly(4));
    return getInt32(data, 0, littleEndian);
});
export const u64 = number(8, (value, { buffer, index, littleEndian }) => {
    setUint64(buffer, index, value, littleEndian);
}, function* (then, reader, { littleEndian }) {
    const data = yield* then(reader.readExactly(8));
    return getUint64(data, 0, littleEndian);
});
export const s64 = number(8, (value, { buffer, index, littleEndian }) => {
    setInt64(buffer, index, value, littleEndian);
}, function* (then, reader, { littleEndian }) {
    const data = yield* then(reader.readExactly(8));
    return getInt64(data, 0, littleEndian);
});
//# sourceMappingURL=number.js.map