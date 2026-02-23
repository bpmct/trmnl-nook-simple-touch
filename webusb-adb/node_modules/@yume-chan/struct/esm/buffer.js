import { field } from "./field/index.js";
export const EmptyUint8Array = new Uint8Array(0);
function copyMaybeDifferentLength(dest, source, index, length) {
    if (source.length < length) {
        dest.set(source, index);
        // Clear trailing bytes
        dest.fill(0, index + source.length, index + length);
    }
    else if (source.length === length) {
        dest.set(source, index);
    }
    else {
        dest.set(source.subarray(0, length), index);
    }
}
/* #__NO_SIDE_EFFECTS__ */
export function buffer(lengthOrField, converter) {
    // Fixed length
    if (typeof lengthOrField === "number") {
        let serialize;
        let deserialize;
        let init;
        if (lengthOrField === 0) {
            serialize = () => { };
            if (converter) {
                // eslint-disable-next-line require-yield
                deserialize = function* () {
                    return converter.convert(EmptyUint8Array);
                };
            }
            else {
                // eslint-disable-next-line require-yield
                deserialize = function* () {
                    return EmptyUint8Array;
                };
            }
        }
        else {
            serialize = (value, { buffer, index }) => copyMaybeDifferentLength(buffer, value, index, lengthOrField);
            if (converter) {
                deserialize = function* (then, reader) {
                    const array = reader.readExactly(lengthOrField);
                    return converter.convert(yield* then(array));
                };
                init = (value) => converter.back(value);
            }
            else {
                // eslint-disable-next-line require-yield
                deserialize = function* (_then, reader) {
                    const array = reader.readExactly(lengthOrField);
                    return array;
                };
            }
        }
        return field(lengthOrField, "byob", serialize, deserialize, { init });
    }
    // Declare length field
    // Some field types are `function`s
    if ((typeof lengthOrField === "object" ||
        typeof lengthOrField === "function") &&
        "serialize" in lengthOrField) {
        let deserialize;
        let init;
        if (converter) {
            deserialize = function* (then, reader, context) {
                const length = yield* then(lengthOrField.deserialize(reader, context));
                const array = length !== 0 ? reader.readExactly(length) : EmptyUint8Array;
                return converter.convert(yield* then(array));
            };
            init = (value) => converter.back(value);
        }
        else {
            deserialize = function* (then, reader, context) {
                const length = yield* then(lengthOrField.deserialize(reader, context));
                const array = length !== 0 ? reader.readExactly(length) : EmptyUint8Array;
                return array;
            };
        }
        return field(lengthOrField.size, "default", (value, { littleEndian }) => {
            if (lengthOrField.type === "default") {
                const lengthBuffer = lengthOrField.serialize(value.length, {
                    littleEndian,
                });
                if (value.length === 0) {
                    return lengthBuffer;
                }
                const result = new Uint8Array(lengthBuffer.length + value.length);
                result.set(lengthBuffer, 0);
                result.set(value, lengthBuffer.length);
                return result;
            }
            else {
                const result = new Uint8Array(lengthOrField.size + value.length);
                lengthOrField.serialize(value.length, {
                    buffer: result,
                    index: 0,
                    littleEndian,
                });
                result.set(value, lengthOrField.size);
                return result;
            }
        }, deserialize, { init });
    }
    // Reference existing length field
    if (typeof lengthOrField === "string") {
        let deserialize;
        let init;
        if (converter) {
            deserialize = function* (then, reader, { dependencies }) {
                const length = dependencies[lengthOrField];
                const array = length !== 0 ? reader.readExactly(length) : EmptyUint8Array;
                return converter.convert(yield* then(array));
            };
            init = (value, dependencies) => {
                const array = converter.back(value);
                dependencies[lengthOrField] = array.length;
                return array;
            };
        }
        else {
            // eslint-disable-next-line require-yield
            deserialize = function* (_then, reader, { dependencies }) {
                const length = dependencies[lengthOrField];
                const array = length !== 0 ? reader.readExactly(length) : EmptyUint8Array;
                return array;
            };
            init = (value, dependencies) => {
                const array = value;
                dependencies[lengthOrField] = array.length;
                return array;
            };
        }
        return field(0, "default", (source) => source, deserialize, { init });
    }
    let deserialize;
    let init;
    // Reference existing length field + length converter
    if (converter) {
        deserialize = function* (then, reader, { dependencies }) {
            const rawLength = dependencies[lengthOrField.field];
            const length = lengthOrField.convert(rawLength);
            const array = length !== 0 ? reader.readExactly(length) : EmptyUint8Array;
            return converter.convert(yield* then(array));
        };
        init = (value, dependencies) => {
            const array = converter.back(value);
            dependencies[lengthOrField.field] = lengthOrField.back(array.length);
            return array;
        };
    }
    else {
        // eslint-disable-next-line require-yield
        deserialize = function* (_then, reader, { dependencies }) {
            const rawLength = dependencies[lengthOrField.field];
            const length = lengthOrField.convert(rawLength);
            const array = length !== 0 ? reader.readExactly(length) : EmptyUint8Array;
            return array;
        };
        init = (value, dependencies) => {
            const array = value;
            dependencies[lengthOrField.field] = lengthOrField.back(array.length);
            return array;
        };
    }
    return field(0, "default", (source) => source, deserialize, { init });
}
//# sourceMappingURL=buffer.js.map