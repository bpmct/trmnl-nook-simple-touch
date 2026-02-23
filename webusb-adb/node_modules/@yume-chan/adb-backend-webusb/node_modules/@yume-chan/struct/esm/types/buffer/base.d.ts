import type { StructAsyncDeserializeStream, StructDeserializeStream, StructOptions, StructValue } from "../../basic/index.js";
import { StructFieldDefinition, StructFieldValue } from "../../basic/index.js";
/**
 * Base class for all types that
 * can be converted from an `Uint8Array` when deserialized,
 * and need to be converted to an `Uint8Array` when serializing
 *
 * @template TValue The actual TypeScript type of this type
 * @template TTypeScriptType Optional another type (should be compatible with `TType`)
 * specified by user when creating field definitions.
 */
export declare abstract class BufferFieldSubType<TValue = unknown, TTypeScriptType = TValue> {
    readonly TTypeScriptType: TTypeScriptType;
    /**
     * When implemented in derived classes, converts the type-specific `value` to an `Uint8Array`
     *
     * This function should be "pure", i.e.,
     * same `value` should always be converted to `Uint8Array`s that have same content.
     */
    abstract toBuffer(value: TValue): Uint8Array;
    /** When implemented in derived classes, converts the `Uint8Array` to a type-specific value */
    abstract toValue(array: Uint8Array): TValue;
    /**
     * When implemented in derived classes, gets the size in byte of the type-specific `value`.
     *
     * If the size can't be calculated without first converting the `value` back to an `Uint8Array`,
     * implementer can returns `-1`, so the caller will get its size by first converting it to
     * an `Uint8Array` (and cache the result).
     */
    abstract getSize(value: TValue): number;
}
/** An `BufferFieldSubType` that's actually an `Uint8Array` */
export declare class Uint8ArrayBufferFieldSubType<TTypeScriptType = Uint8Array> extends BufferFieldSubType<Uint8Array, TTypeScriptType> {
    static readonly Instance: Uint8ArrayBufferFieldSubType<Uint8Array>;
    protected constructor();
    toBuffer(value: Uint8Array): Uint8Array;
    toValue(buffer: Uint8Array): Uint8Array;
    getSize(value: Uint8Array): number;
}
/** An `BufferFieldSubType` that converts between `Uint8Array` and `string` */
export declare class StringBufferFieldSubType<TTypeScriptType = string> extends BufferFieldSubType<string, TTypeScriptType> {
    static readonly Instance: StringBufferFieldSubType<string>;
    toBuffer(value: string): Uint8Array;
    toValue(array: Uint8Array): string;
    getSize(): number;
}
export declare const EMPTY_UINT8_ARRAY: Uint8Array;
export declare abstract class BufferLikeFieldDefinition<TType extends BufferFieldSubType<any, any> = BufferFieldSubType<unknown, unknown>, TOptions = void, TOmitInitKey extends PropertyKey = never, TTypeScriptType = TType["TTypeScriptType"]> extends StructFieldDefinition<TOptions, TTypeScriptType, TOmitInitKey> {
    readonly type: TType;
    constructor(type: TType, options: TOptions);
    protected getDeserializeSize(struct: StructValue): number;
    /**
     * When implemented in derived classes, creates a `StructFieldValue` for the current field definition.
     */
    create(options: Readonly<StructOptions>, struct: StructValue, value: TType["TTypeScriptType"], array?: Uint8Array): BufferLikeFieldValue<this>;
    deserialize(options: Readonly<StructOptions>, stream: StructDeserializeStream, struct: StructValue): BufferLikeFieldValue<this>;
    deserialize(options: Readonly<StructOptions>, stream: StructAsyncDeserializeStream, struct: StructValue): Promise<BufferLikeFieldValue<this>>;
}
export declare class BufferLikeFieldValue<TDefinition extends BufferLikeFieldDefinition<BufferFieldSubType<unknown, unknown>, any, any>> extends StructFieldValue<TDefinition> {
    protected array: Uint8Array | undefined;
    constructor(definition: TDefinition, options: Readonly<StructOptions>, struct: StructValue, value: TDefinition["TValue"], array?: Uint8Array);
    set(value: TDefinition["TValue"]): void;
    serialize(dataView: DataView, offset: number): void;
}
//# sourceMappingURL=base.d.ts.map