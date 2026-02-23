import type { StructAsyncDeserializeStream, StructDeserializeStream, StructFieldDefinition, StructOptions } from "./basic/index.js";
import type { BufferFieldSubType, FixedLengthBufferLikeFieldOptions, LengthField, VariableLengthBufferLikeFieldOptions } from "./types/index.js";
import { BigIntFieldType, FixedLengthBufferLikeFieldDefinition, StringBufferFieldSubType, Uint8ArrayBufferFieldSubType, VariableLengthBufferLikeFieldDefinition } from "./types/index.js";
import type { Evaluate, Identity, Overwrite } from "./utils.js";
export interface StructLike<TValue> {
    deserialize(stream: StructDeserializeStream | StructAsyncDeserializeStream): Promise<TValue>;
}
/**
 * Extract the value type of the specified `Struct`
 */
export type StructValueType<T extends StructLike<unknown>> = Awaited<ReturnType<T["deserialize"]>>;
/**
 * Create a new `Struct` type with `TDefinition` appended
 */
type AddFieldDescriptor<TFields extends object, TOmitInitKey extends PropertyKey, TExtra extends object, TPostDeserialized, TFieldName extends PropertyKey, TDefinition extends StructFieldDefinition<any, any, any>> = Identity<Struct<Evaluate<TFields & Record<TFieldName, TDefinition["TValue"]>>, TOmitInitKey | TDefinition["TOmitInitKey"], TExtra, TPostDeserialized>>;
/**
 * Similar to `ArrayBufferLikeFieldCreator`, but bind to `TType`
 */
interface BoundArrayBufferLikeFieldDefinitionCreator<TFields extends object, TOmitInitKey extends PropertyKey, TExtra extends object, TPostDeserialized, TType extends BufferFieldSubType<any, any>> {
    <TName extends PropertyKey, TTypeScriptType = TType["TTypeScriptType"]>(name: TName, options: FixedLengthBufferLikeFieldOptions, typeScriptType?: TTypeScriptType): AddFieldDescriptor<TFields, TOmitInitKey, TExtra, TPostDeserialized, TName, FixedLengthBufferLikeFieldDefinition<TType, FixedLengthBufferLikeFieldOptions, TTypeScriptType>>;
    <TName extends PropertyKey, TLengthField extends LengthField<TFields>, TOptions extends VariableLengthBufferLikeFieldOptions<TFields, TLengthField>, TTypeScriptType = TType["TTypeScriptType"]>(name: TName, options: TOptions, typeScriptType?: TTypeScriptType): AddFieldDescriptor<TFields, TOmitInitKey, TExtra, TPostDeserialized, TName, VariableLengthBufferLikeFieldDefinition<TType, TOptions, TTypeScriptType>>;
}
export type StructPostDeserialized<TFields, TPostDeserialized> = (this: TFields, object: TFields) => TPostDeserialized;
export type StructDeserializedResult<TFields extends object, TExtra extends object, TPostDeserialized> = TPostDeserialized extends undefined ? Overwrite<TExtra, TFields> : TPostDeserialized;
export declare class Struct<TFields extends object = Record<never, never>, TOmitInitKey extends PropertyKey = never, TExtra extends object = Record<never, never>, TPostDeserialized = undefined> implements StructLike<StructDeserializedResult<TFields, TExtra, TPostDeserialized>> {
    readonly TFields: TFields;
    readonly TOmitInitKey: TOmitInitKey;
    readonly TExtra: TExtra;
    readonly TInit: Evaluate<Omit<TFields, TOmitInitKey>>;
    readonly TDeserializeResult: StructDeserializedResult<TFields, TExtra, TPostDeserialized>;
    readonly options: Readonly<StructOptions>;
    private _size;
    /**
     * Gets the static size (exclude fields that can change size at runtime)
     */
    get size(): number;
    private _fields;
    private _extra;
    private _postDeserialized?;
    constructor(options?: Partial<Readonly<StructOptions>>);
    /**
     * Appends a `StructFieldDefinition` to the `Struct
     */
    field<TName extends PropertyKey, TDefinition extends StructFieldDefinition<any, any, any>>(name: TName, definition: TDefinition): AddFieldDescriptor<TFields, TOmitInitKey, TExtra, TPostDeserialized, TName, TDefinition>;
    /**
     * Merges (flats) another `Struct`'s fields and extra fields into this one.
     */
    fields<TOther extends Struct<any, any, any, any>>(other: TOther): Struct<TFields & TOther["TFields"], TOmitInitKey | TOther["TOmitInitKey"], TExtra & TOther["TExtra"], TPostDeserialized>;
    private number;
    /**
     * Appends an `int8` field to the `Struct`
     */
    int8<TName extends PropertyKey, TTypeScriptType = number>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    /**
     * Appends an `uint8` field to the `Struct`
     */
    uint8<TName extends PropertyKey, TTypeScriptType = number>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    /**
     * Appends an `int16` field to the `Struct`
     */
    int16<TName extends PropertyKey, TTypeScriptType = number>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    /**
     * Appends an `uint16` field to the `Struct`
     */
    uint16<TName extends PropertyKey, TTypeScriptType = number>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    /**
     * Appends an `int32` field to the `Struct`
     */
    int32<TName extends PropertyKey, TTypeScriptType = number>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    /**
     * Appends an `uint32` field to the `Struct`
     */
    uint32<TName extends PropertyKey, TTypeScriptType = number>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    private bigint;
    /**
     * Appends an `int64` field to the `Struct`
     *
     * Requires native `BigInt` support
     */
    int64<TName extends PropertyKey, TTypeScriptType = BigIntFieldType["TTypeScriptType"]>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    /**
     * Appends an `uint64` field to the `Struct`
     *
     * Requires native `BigInt` support
     */
    uint64<TName extends PropertyKey, TTypeScriptType = BigIntFieldType["TTypeScriptType"]>(name: TName, typeScriptType?: TTypeScriptType): Struct<Evaluate<TFields & Record<TName, TTypeScriptType>>, TOmitInitKey, TExtra, TPostDeserialized>;
    private arrayBufferLike;
    uint8Array: BoundArrayBufferLikeFieldDefinitionCreator<TFields, TOmitInitKey, TExtra, TPostDeserialized, Uint8ArrayBufferFieldSubType>;
    string: BoundArrayBufferLikeFieldDefinitionCreator<TFields, TOmitInitKey, TExtra, TPostDeserialized, StringBufferFieldSubType>;
    /**
     * Adds some extra properties into every `Struct` value.
     *
     * Extra properties will not affect serialize or deserialize process.
     *
     * Multiple calls to `extra` will merge all properties together.
     *
     * @param value
     * An object containing properties to be added to the result value. Accessors and methods are also allowed.
     */
    extra<T extends Record<Exclude<keyof T, Exclude<keyof T, keyof TFields>>, never>>(value: T & ThisType<Overwrite<Overwrite<TExtra, T>, TFields>>): Struct<TFields, TOmitInitKey, Overwrite<TExtra, T>, TPostDeserialized>;
    /**
     * Registers (or replaces) a custom callback to be run after deserialized.
     *
     * A callback returning `never` (always throw an error)
     * will also change the return type of `deserialize` to `never`.
     */
    postDeserialize(callback: StructPostDeserialized<TFields, never>): Struct<TFields, TOmitInitKey, TExtra, never>;
    /**
     * Registers (or replaces) a custom callback to be run after deserialized.
     *
     * A callback returning `void` means it modify the result object in-place
     * (or doesn't modify it at all), so `deserialize` will still return the result object.
     */
    postDeserialize(callback?: StructPostDeserialized<TFields, void>): Struct<TFields, TOmitInitKey, TExtra, undefined>;
    /**
     * Registers (or replaces) a custom callback to be run after deserialized.
     *
     * A callback returning anything other than `undefined`
     * will `deserialize` to return that object instead.
     */
    postDeserialize<TPostSerialize>(callback?: StructPostDeserialized<TFields, TPostSerialize>): Struct<TFields, TOmitInitKey, TExtra, TPostSerialize>;
    /**
     * Deserialize a struct value from `stream`.
     */
    deserialize(stream: StructDeserializeStream): StructDeserializedResult<TFields, TExtra, TPostDeserialized>;
    deserialize(stream: StructAsyncDeserializeStream): Promise<StructDeserializedResult<TFields, TExtra, TPostDeserialized>>;
    serialize(init: Evaluate<Omit<TFields, TOmitInitKey>>): Uint8Array;
    serialize(init: Evaluate<Omit<TFields, TOmitInitKey>>, output: Uint8Array): number;
}
export {};
//# sourceMappingURL=struct.d.ts.map