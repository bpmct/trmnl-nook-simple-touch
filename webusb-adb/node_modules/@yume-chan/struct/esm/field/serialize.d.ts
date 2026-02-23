import type { FieldByobSerializeContext, FieldDefaultSerializeContext, FieldSerializer } from "./types.js";
export type DefaultFieldSerializer<T> = (source: T, context: FieldDefaultSerializeContext) => Uint8Array;
export declare function defaultFieldSerializer<T>(serializer: DefaultFieldSerializer<T>): FieldSerializer<T>["serialize"];
export type ByobFieldSerializer<T> = (source: T, context: FieldByobSerializeContext & {
    index: number;
}) => void;
export declare function byobFieldSerializer<T>(size: number, serializer: ByobFieldSerializer<T>): FieldSerializer<T>["serialize"];
//# sourceMappingURL=serialize.d.ts.map