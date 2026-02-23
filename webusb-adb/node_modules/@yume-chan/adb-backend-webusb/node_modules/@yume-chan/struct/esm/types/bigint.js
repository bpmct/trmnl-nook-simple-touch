import { getBigInt64, getBigUint64, setBigInt64, setBigUint64, } from "@yume-chan/dataview-bigint-polyfill/esm/fallback.js";
import { StructFieldDefinition, StructFieldValue } from "../basic/index.js";
import { SyncPromise } from "../sync-promise.js";
class BigIntFieldType {
    TTypeScriptType;
    size;
    getter;
    setter;
    constructor(size, getter, setter) {
        this.size = size;
        this.getter = getter;
        this.setter = setter;
    }
    static Int64 = new BigIntFieldType(8, getBigInt64, setBigInt64);
    static Uint64 = new BigIntFieldType(8, getBigUint64, setBigUint64);
}
export { BigIntFieldType };
export class BigIntFieldDefinition extends StructFieldDefinition {
    type;
    constructor(type, typescriptType) {
        void typescriptType;
        super();
        this.type = type;
    }
    getSize() {
        return this.type.size;
    }
    create(options, struct, value) {
        return new BigIntFieldValue(this, options, struct, value);
    }
    deserialize(options, stream, struct) {
        return SyncPromise.try(() => {
            return stream.read(this.getSize());
        })
            .then((array) => {
            const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
            const value = this.type.getter(view, 0, options.littleEndian);
            return this.create(options, struct, value);
        })
            .valueOrPromise();
    }
}
export class BigIntFieldValue extends StructFieldValue {
    serialize(dataView, offset) {
        this.definition.type.setter(dataView, offset, this.value, this.options.littleEndian);
    }
}
//# sourceMappingURL=bigint.js.map