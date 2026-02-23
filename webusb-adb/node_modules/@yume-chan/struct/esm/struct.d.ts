import type { Field, FieldDeserializer } from "./field/index.js";
import type { StructDeserializer, StructLike, StructSerializer } from "./types.js";
export type StructField = Field<unknown, string, unknown, unknown> | (StructSerializer<unknown> & StructDeserializer<unknown>);
export type StructFields = Record<string, StructField>;
export type FieldsValue<T extends StructFields> = {
    [K in keyof T]: T[K] extends FieldDeserializer<infer U, unknown> ? U : never;
};
export type FieldOmitInit<T extends StructField> = T extends Field<unknown, infer U, unknown, unknown> ? string extends U ? never : U : never;
export type FieldsOmitInits<T extends StructFields> = {
    [K in keyof T]: FieldOmitInit<T[K]>;
}[keyof T];
export type FieldsInit<T extends StructFields> = Omit<FieldsValue<T>, FieldsOmitInits<T>>;
export declare class StructDeserializeError extends Error {
    constructor(message: string);
}
export declare class StructNotEnoughDataError extends StructDeserializeError {
    constructor();
}
export declare class StructEmptyError extends StructDeserializeError {
    constructor();
}
export type ExtraToIntersection<Extra extends Record<PropertyKey, unknown> | undefined> = Extra extends undefined ? unknown : Extra;
export interface Struct<Fields extends StructFields, Extra extends Record<PropertyKey, unknown> | undefined = undefined, PostDeserialize = FieldsValue<Fields> & Extra> extends StructSerializer<FieldsInit<Fields>>, StructDeserializer<PostDeserialize> {
    littleEndian: boolean;
    fields: Fields;
    extra: Extra;
}
export declare function struct<Fields extends Record<string, Field<unknown, string, Partial<FieldsValue<Fields>>, unknown> | StructLike<unknown>>, Extra extends Record<PropertyKey, unknown> | undefined = undefined, PostDeserialize = FieldsValue<Fields> & ExtraToIntersection<Extra>>(fields: Fields, options: {
    littleEndian: boolean;
    extra?: (Extra & ThisType<FieldsValue<Fields>>) | undefined;
    postDeserialize?: ((this: FieldsValue<Fields> & ExtraToIntersection<Extra>, value: FieldsValue<Fields> & ExtraToIntersection<Extra>) => PostDeserialize) | undefined;
}): Struct<Fields, Extra, PostDeserialize>;
//# sourceMappingURL=struct.d.ts.map