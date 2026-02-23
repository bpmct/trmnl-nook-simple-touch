/**
 * A field definition defines how to deserialize a field.
 *
 * @template TOptions TypeScript type of this definition's `options`.
 * @template TValue TypeScript type of this field.
 * @template TOmitInitKey Optionally remove some fields from the init type. Should be a union of string literal types.
 */
export class StructFieldDefinition {
    /**
     * When `T` is a type initiated `StructFieldDefinition`,
     * use `T['TValue']` to retrieve its `TValue` type parameter.
     */
    TValue;
    /**
     * When `T` is a type initiated `StructFieldDefinition`,
     * use `T['TOmitInitKey']` to retrieve its `TOmitInitKey` type parameter.
     */
    TOmitInitKey;
    options;
    constructor(options) {
        this.options = options;
    }
}
//# sourceMappingURL=definition.js.map