/**
 * A field value defines how to serialize a field.
 *
 * It may contains extra metadata about the value which are essential or
 * helpful for the serialization process.
 */
export class StructFieldValue {
    /** Gets the definition associated with this runtime value */
    definition;
    /** Gets the options of the associated `Struct` */
    options;
    /** Gets the associated `Struct` instance */
    struct;
    get hasCustomAccessors() {
        return (this.get !== StructFieldValue.prototype.get ||
            this.set !== StructFieldValue.prototype.set);
    }
    value;
    constructor(definition, options, struct, value) {
        this.definition = definition;
        this.options = options;
        this.struct = struct;
        this.value = value;
    }
    /**
     * Gets size of this field. By default, it returns its `definition`'s size.
     *
     * When overridden in derived classes, can have custom logic to calculate the actual size.
     */
    getSize() {
        return this.definition.getSize();
    }
    /**
     * When implemented in derived classes, reads current field's value.
     */
    get() {
        return this.value;
    }
    /**
     * When implemented in derived classes, updates current field's value.
     */
    set(value) {
        this.value = value;
    }
}
//# sourceMappingURL=field-value.js.map