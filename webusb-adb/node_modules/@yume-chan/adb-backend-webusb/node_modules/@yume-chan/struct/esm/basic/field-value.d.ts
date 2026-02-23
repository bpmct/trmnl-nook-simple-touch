import type { StructFieldDefinition } from "./definition.js";
import type { StructOptions } from "./options.js";
import type { StructValue } from "./struct-value.js";
/**
 * A field value defines how to serialize a field.
 *
 * It may contains extra metadata about the value which are essential or
 * helpful for the serialization process.
 */
export declare abstract class StructFieldValue<TDefinition extends StructFieldDefinition<any, any, any> = StructFieldDefinition<any, any, any>> {
    /** Gets the definition associated with this runtime value */
    readonly definition: TDefinition;
    /** Gets the options of the associated `Struct` */
    readonly options: Readonly<StructOptions>;
    /** Gets the associated `Struct` instance */
    readonly struct: StructValue;
    get hasCustomAccessors(): boolean;
    protected value: TDefinition["TValue"];
    constructor(definition: TDefinition, options: Readonly<StructOptions>, struct: StructValue, value: TDefinition["TValue"]);
    /**
     * Gets size of this field. By default, it returns its `definition`'s size.
     *
     * When overridden in derived classes, can have custom logic to calculate the actual size.
     */
    getSize(): number;
    /**
     * When implemented in derived classes, reads current field's value.
     */
    get(): TDefinition["TValue"];
    /**
     * When implemented in derived classes, updates current field's value.
     */
    set(value: TDefinition["TValue"]): void;
    /**
     * When implemented in derived classes, serializes this field into `dataView` at `offset`
     */
    abstract serialize(dataView: DataView, offset: number): void;
}
//# sourceMappingURL=field-value.d.ts.map