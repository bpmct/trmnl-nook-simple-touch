import { StructFieldDefinition, StructFieldValue } from "../../basic/index.js";
import { SyncPromise } from "../../sync-promise.js";
import { decodeUtf8, encodeUtf8 } from "../../utils.js";
/**
 * Base class for all types that
 * can be converted from an `Uint8Array` when deserialized,
 * and need to be converted to an `Uint8Array` when serializing
 *
 * @template TValue The actual TypeScript type of this type
 * @template TTypeScriptType Optional another type (should be compatible with `TType`)
 * specified by user when creating field definitions.
 */
export class BufferFieldSubType {
    TTypeScriptType;
}
/** An `BufferFieldSubType` that's actually an `Uint8Array` */
class Uint8ArrayBufferFieldSubType extends BufferFieldSubType {
    static Instance = new Uint8ArrayBufferFieldSubType();
    constructor() {
        super();
    }
    toBuffer(value) {
        return value;
    }
    toValue(buffer) {
        return buffer;
    }
    getSize(value) {
        return value.byteLength;
    }
}
export { Uint8ArrayBufferFieldSubType };
/** An `BufferFieldSubType` that converts between `Uint8Array` and `string` */
class StringBufferFieldSubType extends BufferFieldSubType {
    static Instance = new StringBufferFieldSubType();
    toBuffer(value) {
        return encodeUtf8(value);
    }
    toValue(array) {
        return decodeUtf8(array);
    }
    getSize() {
        // Return `-1`, so `BufferLikeFieldDefinition` will
        // convert this `value` into an `Uint8Array` (and cache the result),
        // Then get the size from that `Uint8Array`
        return -1;
    }
}
export { StringBufferFieldSubType };
export const EMPTY_UINT8_ARRAY = new Uint8Array(0);
export class BufferLikeFieldDefinition extends StructFieldDefinition {
    type;
    constructor(type, options) {
        super(options);
        this.type = type;
    }
    getDeserializeSize(struct) {
        void struct;
        return this.getSize();
    }
    /**
     * When implemented in derived classes, creates a `StructFieldValue` for the current field definition.
     */
    create(options, struct, value, array) {
        return new BufferLikeFieldValue(this, options, struct, value, array);
    }
    deserialize(options, stream, struct) {
        return SyncPromise.try(() => {
            const size = this.getDeserializeSize(struct);
            if (size === 0) {
                return EMPTY_UINT8_ARRAY;
            }
            else {
                return stream.read(size);
            }
        })
            .then((array) => {
            const value = this.type.toValue(array);
            return this.create(options, struct, value, array);
        })
            .valueOrPromise();
    }
}
export class BufferLikeFieldValue extends StructFieldValue {
    array;
    constructor(definition, options, struct, value, array) {
        super(definition, options, struct, value);
        this.array = array;
    }
    set(value) {
        super.set(value);
        // When value changes, clear the cached `array`
        // It will be lazily calculated in `serialize()`
        this.array = undefined;
    }
    serialize(dataView, offset) {
        if (!this.array) {
            this.array = this.definition.type.toBuffer(this.value);
        }
        new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength).set(this.array, offset);
    }
}
//# sourceMappingURL=base.js.map