import { bipedal } from "./bipedal.js";
import { ExactReadableEndedError } from "./readable.js";
export class StructDeserializeError extends Error {
    constructor(message) {
        super(message);
    }
}
export class StructNotEnoughDataError extends StructDeserializeError {
    constructor() {
        super("The underlying readable was ended before the struct was fully deserialized");
    }
}
export class StructEmptyError extends StructDeserializeError {
    constructor() {
        super("The underlying readable doesn't contain any more struct");
    }
}
/* #__NO_SIDE_EFFECTS__ */
export function struct(fields, options) {
    const fieldList = Object.entries(fields);
    let size = 0;
    let byob = true;
    for (const [, field] of fieldList) {
        size += field.size;
        if (byob && field.type !== "byob") {
            byob = false;
        }
    }
    const littleEndian = options.littleEndian;
    const extra = options.extra
        ? Object.getOwnPropertyDescriptors(options.extra)
        : undefined;
    return {
        littleEndian,
        fields,
        extra: options.extra,
        type: byob ? "byob" : "default",
        size,
        serialize(source, bufferOrContext) {
            const temp = { ...source };
            for (const [key, field] of fieldList) {
                if (key in temp && "init" in field) {
                    const result = field.init?.(temp[key], temp);
                    temp[key] = result;
                }
            }
            const sizes = new Array(fieldList.length);
            const buffers = new Array(fieldList.length);
            {
                const context = { littleEndian };
                for (const [index, [key, field]] of fieldList.entries()) {
                    if (field.type === "byob") {
                        sizes[index] = field.size;
                    }
                    else {
                        buffers[index] = field.serialize(temp[key], context);
                        sizes[index] = buffers[index].length;
                    }
                }
            }
            const size = sizes.reduce((sum, size) => sum + size, 0);
            let externalBuffer;
            let buffer;
            let index;
            if (bufferOrContext instanceof Uint8Array) {
                if (bufferOrContext.length < size) {
                    throw new Error("Buffer too small");
                }
                externalBuffer = true;
                buffer = bufferOrContext;
                index = 0;
            }
            else if (typeof bufferOrContext === "object" &&
                "buffer" in bufferOrContext) {
                externalBuffer = true;
                buffer = bufferOrContext.buffer;
                index = bufferOrContext.index ?? 0;
                if (buffer.length - index < size) {
                    throw new Error("Buffer too small");
                }
            }
            else {
                externalBuffer = false;
                buffer = new Uint8Array(size);
                index = 0;
            }
            const context = {
                buffer,
                index,
                littleEndian,
            };
            for (const [index, [key, field]] of fieldList.entries()) {
                if (buffers[index]) {
                    buffer.set(buffers[index], context.index);
                }
                else {
                    field.serialize(temp[key], context);
                }
                context.index += sizes[index];
            }
            if (externalBuffer) {
                return size;
            }
            else {
                return buffer;
            }
        },
        deserialize: bipedal(function* (then, reader) {
            const startPosition = reader.position;
            const result = {};
            const context = {
                dependencies: result,
                littleEndian: littleEndian,
            };
            try {
                for (const [key, field] of fieldList) {
                    result[key] = yield* then(field.deserialize(reader, context));
                }
            }
            catch (e) {
                if (!(e instanceof ExactReadableEndedError)) {
                    throw e;
                }
                if (reader.position === startPosition) {
                    throw new StructEmptyError();
                }
                else {
                    throw new StructNotEnoughDataError();
                }
            }
            if (extra) {
                Object.defineProperties(result, extra);
            }
            if (options.postDeserialize) {
                return options.postDeserialize.call(result, result);
            }
            else {
                return result;
            }
        }),
    };
}
//# sourceMappingURL=struct.js.map