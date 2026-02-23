import { StructFieldDefinition, StructFieldValue } from "../basic/index.js";
import { SyncPromise } from "../sync-promise.js";
// eslint-disable-next-line @typescript-eslint/no-namespace
export var NumberFieldType;
(function (NumberFieldType) {
    NumberFieldType.Uint8 = {
        signed: false,
        size: 1,
        deserialize(array) {
            return array[0];
        },
        serialize(dataView, offset, value) {
            dataView.setUint8(offset, value);
        },
    };
    NumberFieldType.Int8 = {
        signed: true,
        size: 1,
        deserialize(array) {
            const value = NumberFieldType.Uint8.deserialize(array, false);
            return (value << 24) >> 24;
        },
        serialize(dataView, offset, value) {
            dataView.setInt8(offset, value);
        },
    };
    NumberFieldType.Uint16 = {
        signed: false,
        size: 2,
        deserialize(array, littleEndian) {
            // PERF: Chrome's `DataView#getUint16` uses inefficient operations,
            // including branching, bit extending and 32-bit bit swapping.
            // The best way should use 16-bit bit rotation and conditional move,
            // like LLVM does for code similar to the below one.
            // This code is much faster on V8, but the actual generated assembly is unknown.
            return ((((array[1] << 8) | array[0]) * littleEndian) |
                (((array[0] << 8) | array[1]) * !littleEndian));
        },
        serialize(dataView, offset, value, littleEndian) {
            dataView.setUint16(offset, value, littleEndian);
        },
    };
    NumberFieldType.Int16 = {
        signed: true,
        size: 2,
        deserialize(array, littleEndian) {
            const value = NumberFieldType.Uint16.deserialize(array, littleEndian);
            return (value << 16) >> 16;
        },
        serialize(dataView, offset, value, littleEndian) {
            dataView.setInt16(offset, value, littleEndian);
        },
    };
    NumberFieldType.Uint32 = {
        signed: false,
        size: 4,
        deserialize(array, littleEndian) {
            const value = NumberFieldType.Int32.deserialize(array, littleEndian);
            return value >>> 0;
        },
        serialize(dataView, offset, value, littleEndian) {
            dataView.setUint32(offset, value, littleEndian);
        },
    };
    NumberFieldType.Int32 = {
        signed: true,
        size: 4,
        deserialize(array, littleEndian) {
            return ((((array[3] << 24) |
                (array[2] << 16) |
                (array[1] << 8) |
                array[0]) *
                littleEndian) |
                (((array[0] << 24) |
                    (array[1] << 16) |
                    (array[2] << 8) |
                    array[3]) *
                    !littleEndian));
        },
        serialize(dataView, offset, value, littleEndian) {
            dataView.setInt32(offset, value, littleEndian);
        },
    };
})(NumberFieldType = NumberFieldType || (NumberFieldType = {}));
export class NumberFieldDefinition extends StructFieldDefinition {
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
        return new NumberFieldValue(this, options, struct, value);
    }
    deserialize(options, stream, struct) {
        return SyncPromise.try(() => {
            return stream.read(this.getSize());
        })
            .then((array) => {
            const value = this.type.deserialize(array, options.littleEndian);
            return this.create(options, struct, value);
        })
            .valueOrPromise();
    }
}
export class NumberFieldValue extends StructFieldValue {
    serialize(dataView, offset) {
        this.definition.type.serialize(dataView, offset, this.value, this.options.littleEndian);
    }
}
//# sourceMappingURL=number.js.map