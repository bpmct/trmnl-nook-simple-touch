import type { BufferLengthConverter } from "./buffer.js";
import type { Field } from "./field/index.js";
export interface String {
    (length: number): Field<string, never, never> & {
        as: <T>(infer: T) => Field<T, never, never>;
    };
    <K extends string>(lengthField: K): Field<string, K, Record<K, number>> & {
        as: <T>(infer: T) => Field<T, K, Record<K, number>>;
    };
    <const K extends string, KT>(length: BufferLengthConverter<K, KT>): Field<string, K, Record<K, KT>> & {
        as: <T>(infer: T) => Field<T, K, Record<K, KT>>;
    };
    <KOmitInit extends string, KS>(length: Field<number, KOmitInit, KS>): Field<string, KOmitInit, KS>;
}
export declare const string: String;
//# sourceMappingURL=string.d.ts.map