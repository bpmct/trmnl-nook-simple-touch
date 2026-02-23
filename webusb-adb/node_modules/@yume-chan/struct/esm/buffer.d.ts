import type { Field } from "./field/index.js";
export declare const EmptyUint8Array: Uint8Array<ArrayBuffer>;
export interface Converter<From, To> {
    convert: (value: From) => To;
    back: (value: To) => From;
}
export interface BufferLengthConverter<K, KT> extends Converter<KT, number> {
    field: K;
}
/**
 * Create a fixed-length `Uint8Array` field.
 *
 * @param length Length of the field
 */
export declare function buffer(length: number): Field<Uint8Array, never, never, Uint8Array>;
/**
 * Create a custom-typed field, backed by a fixed-length `Uint8Array`.
 *
 * @param length Length of the field
 * @param converter A value converter to convert between `Uint8Array` and the target type
 */
export declare function buffer<U>(length: number, converter: Converter<Uint8Array, U>): Field<U, never, never, Uint8Array>;
/**
 * Create a variable-length `Uint8Array` field.
 * The length is determined by another number-typed field.
 *
 * @param lengthField Name of the length field. Must be declared before this field
 */
export declare function buffer<K extends string>(lengthField: K): Field<Uint8Array, K, Record<K, number>, Uint8Array>;
/**
 * Create a custom-typed field, backed by a variable-length `Uint8Array`.
 * The length is determined by another number-typed field.
 *
 * @param lengthField Name of the length field. Must be declared before this field
 * @param converter A value converter to convert between `Uint8Array` and the target type
 */
export declare function buffer<K extends string, U>(lengthField: K, converter: Converter<Uint8Array, U>): Field<U, K, Record<K, number>, Uint8Array>;
/**
 * Create a variable-length `Uint8Array` field.
 * The length is determined by converting another field to `number`.
 *
 * @param length
 * Name of the length field,
 * and a converter to convert between source type and `number`.
 * Must be declared before this field
 */
export declare function buffer<K extends string, KT>(length: BufferLengthConverter<K, KT>): Field<Uint8Array, K, Record<K, KT>, Uint8Array>;
/**
 * Create a custom-typed field, backed by a variable-length `Uint8Array`.
 * The length is determined by converting another field to `number`.
 *
 * @param length
 * Name of the length field,
 * and a converter to convert between source type and `number`.
 * Must be declared before this field
 * @param converter
 * A value converter to convert between `Uint8Array` and the target type
 */
export declare function buffer<K extends string, KT, U>(length: BufferLengthConverter<K, KT>, converter: Converter<Uint8Array, U>): Field<U, K, Record<K, KT>, Uint8Array>;
/**
 * Create a length field, and a variable-length `Uint8Array` field.
 * This is a shortcut when the length field is directly before the data field.
 *
 * @param length The length field declaration
 */
export declare function buffer<LengthOmitInit extends string, LengthDependencies>(length: Field<number, LengthOmitInit, LengthDependencies, number>): Field<Uint8Array, LengthOmitInit, LengthDependencies, Uint8Array>;
/**
 * Create a length field, and a custom-typed field, backed by a variable-length `Uint8Array`.
 * This is a shortcut when the length field is directly before the data field.
 *
 * @param length The length field declaration
 * @param converter A value converter to convert between `Uint8Array` and the target type
 */
export declare function buffer<LengthOmitInit extends string, LengthDependencies, U>(length: Field<number, LengthOmitInit, LengthDependencies, number>, converter: Converter<Uint8Array, U>): Field<U, LengthOmitInit, LengthDependencies, Uint8Array>;
//# sourceMappingURL=buffer.d.ts.map