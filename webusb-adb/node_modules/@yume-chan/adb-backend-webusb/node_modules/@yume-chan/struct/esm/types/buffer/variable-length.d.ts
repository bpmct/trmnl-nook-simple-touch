import type { StructFieldDefinition, StructOptions, StructValue } from "../../basic/index.js";
import { StructFieldValue } from "../../basic/index.js";
import type { KeysOfType } from "../../utils.js";
import type { BufferFieldSubType } from "./base.js";
import { BufferLikeFieldDefinition, BufferLikeFieldValue } from "./base.js";
export type LengthField<TFields> = KeysOfType<TFields, number | string>;
export interface VariableLengthBufferLikeFieldOptions<TFields = object, TLengthField extends LengthField<TFields> = any> {
    /**
     * The name of the field that contains the length of the buffer.
     *
     * This field must be a `number` or `string` (can't be `bigint`) field.
     */
    lengthField: TLengthField;
    /**
     * If the `lengthField` refers to a string field,
     * what radix to use when converting the string to a number.
     *
     * @default 10
     */
    lengthFieldRadix?: number;
}
export declare class VariableLengthBufferLikeFieldDefinition<TType extends BufferFieldSubType = BufferFieldSubType, TOptions extends VariableLengthBufferLikeFieldOptions = VariableLengthBufferLikeFieldOptions, TTypeScriptType = TType["TTypeScriptType"]> extends BufferLikeFieldDefinition<TType, TOptions, TOptions["lengthField"], TTypeScriptType> {
    getSize(): number;
    protected getDeserializeSize(struct: StructValue): number;
    create(options: Readonly<StructOptions>, struct: StructValue, value: TTypeScriptType, array?: Uint8Array): VariableLengthBufferLikeStructFieldValue<this>;
}
export declare class VariableLengthBufferLikeStructFieldValue<TDefinition extends VariableLengthBufferLikeFieldDefinition = VariableLengthBufferLikeFieldDefinition> extends BufferLikeFieldValue<TDefinition> {
    protected length: number | undefined;
    protected lengthFieldValue: VariableLengthBufferLikeFieldLengthValue;
    constructor(definition: TDefinition, options: Readonly<StructOptions>, struct: StructValue, value: TDefinition["TValue"], array?: Uint8Array);
    getSize(): number;
    set(value: unknown): void;
}
type VariableLengthBufferLikeFieldValueLike = StructFieldValue<StructFieldDefinition<VariableLengthBufferLikeFieldOptions, any, any>>;
export declare class VariableLengthBufferLikeFieldLengthValue extends StructFieldValue {
    protected originalField: StructFieldValue;
    protected bufferField: VariableLengthBufferLikeFieldValueLike;
    constructor(originalField: StructFieldValue, arrayBufferField: VariableLengthBufferLikeFieldValueLike);
    getSize(): number;
    get(): string | number;
    set(): void;
    serialize(dataView: DataView, offset: number): void;
}
export {};
//# sourceMappingURL=variable-length.d.ts.map