import type { StructFieldValue } from "./field-value.js";
export declare const STRUCT_VALUE_SYMBOL: unique symbol;
/**
 * A struct value is a map between keys in a struct and their field values.
 */
export declare class StructValue {
    /**
     * Gets the result struct value object
     */
    readonly value: Record<PropertyKey, unknown>;
    constructor(prototype: object);
    /**
     * Sets a `StructFieldValue` for `key`
     *
     * @param name The field name
     * @param fieldValue The associated `StructFieldValue`
     */
    set(name: PropertyKey, fieldValue: StructFieldValue): void;
    /**
     * Gets the `StructFieldValue` for `key`
     *
     * @param name The field name
     */
    get(name: PropertyKey): StructFieldValue;
}
//# sourceMappingURL=struct-value.d.ts.map