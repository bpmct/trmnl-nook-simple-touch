import { StructFieldValue } from "../../basic/index.js";
import { BufferLikeFieldDefinition, BufferLikeFieldValue } from "./base.js";
export class VariableLengthBufferLikeFieldDefinition extends BufferLikeFieldDefinition {
    getSize() {
        return 0;
    }
    getDeserializeSize(struct) {
        let value = struct.value[this.options.lengthField];
        if (typeof value === "string") {
            value = Number.parseInt(value, this.options.lengthFieldRadix ?? 10);
        }
        return value;
    }
    create(options, struct, value, array) {
        return new VariableLengthBufferLikeStructFieldValue(this, options, struct, value, array);
    }
}
export class VariableLengthBufferLikeStructFieldValue extends BufferLikeFieldValue {
    length;
    lengthFieldValue;
    constructor(definition, options, struct, value, array) {
        super(definition, options, struct, value, array);
        if (array) {
            this.length = array.byteLength;
        }
        // Patch the associated length field.
        const lengthField = this.definition.options.lengthField;
        const originalValue = struct.get(lengthField);
        this.lengthFieldValue = new VariableLengthBufferLikeFieldLengthValue(originalValue, this);
        struct.set(lengthField, this.lengthFieldValue);
    }
    getSize() {
        if (this.length === undefined) {
            this.length = this.definition.type.getSize(this.value);
            if (this.length === -1) {
                this.array = this.definition.type.toBuffer(this.value);
                this.length = this.array.byteLength;
            }
        }
        return this.length;
    }
    set(value) {
        super.set(value);
        this.array = undefined;
        this.length = undefined;
    }
}
export class VariableLengthBufferLikeFieldLengthValue extends StructFieldValue {
    originalField;
    bufferField;
    constructor(originalField, arrayBufferField) {
        super(originalField.definition, originalField.options, originalField.struct, 0);
        this.originalField = originalField;
        this.bufferField = arrayBufferField;
    }
    getSize() {
        return this.originalField.getSize();
    }
    get() {
        let value = this.bufferField.getSize();
        const originalValue = this.originalField.get();
        if (typeof originalValue === "string") {
            value = value.toString(this.bufferField.definition.options.lengthFieldRadix ?? 10);
        }
        return value;
    }
    set() {
        // Ignore setting
        // It will always be in sync with the buffer size
    }
    serialize(dataView, offset) {
        this.originalField.set(this.get());
        this.originalField.serialize(dataView, offset);
    }
}
//# sourceMappingURL=variable-length.js.map