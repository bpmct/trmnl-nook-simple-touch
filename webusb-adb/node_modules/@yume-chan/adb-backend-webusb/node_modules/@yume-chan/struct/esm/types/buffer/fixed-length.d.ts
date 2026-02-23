import type { BufferFieldSubType } from "./base.js";
import { BufferLikeFieldDefinition } from "./base.js";
export interface FixedLengthBufferLikeFieldOptions {
    length: number;
}
export declare class FixedLengthBufferLikeFieldDefinition<TType extends BufferFieldSubType = BufferFieldSubType, TOptions extends FixedLengthBufferLikeFieldOptions = FixedLengthBufferLikeFieldOptions, TTypeScriptType = TType["TTypeScriptType"]> extends BufferLikeFieldDefinition<TType, TOptions, never, TTypeScriptType> {
    getSize(): number;
}
//# sourceMappingURL=fixed-length.d.ts.map