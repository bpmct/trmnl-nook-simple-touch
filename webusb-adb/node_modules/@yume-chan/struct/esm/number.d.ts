import type { Field } from "./field/index.js";
export interface NumberField<T> extends Field<T, never, never, T> {
    <const U>(infer?: U): Field<U, never, never, T>;
}
export declare const u8: NumberField<number>;
export declare const s8: NumberField<number>;
export declare const u16: NumberField<number>;
export declare const s16: NumberField<number>;
export declare const u32: NumberField<number>;
export declare const s32: NumberField<number>;
export declare const u64: NumberField<bigint>;
export declare const s64: NumberField<bigint>;
//# sourceMappingURL=number.d.ts.map