import type { BipedalGenerator } from "../bipedal.js";
import type { AsyncExactReadable } from "../readable.js";
import type { ByobFieldSerializer, DefaultFieldSerializer } from "./serialize.js";
import type { Field, FieldDeserializeContext, FieldOptions } from "./types.js";
export type BipedalFieldDeserializer<T, D> = BipedalGenerator<undefined, T, [
    reader: AsyncExactReadable,
    context: FieldDeserializeContext<D>
]>;
declare function _field<T, OmitInit extends string, D, Raw = T>(size: number, type: "default", serialize: DefaultFieldSerializer<Raw>, deserialize: BipedalFieldDeserializer<T, D>, options?: FieldOptions<T, OmitInit, D, Raw>): Field<T, OmitInit, D, Raw>;
declare function _field<T, OmitInit extends string, D, Raw = T>(size: number, type: "byob", serialize: ByobFieldSerializer<Raw>, deserialize: BipedalFieldDeserializer<T, D>, options?: FieldOptions<T, OmitInit, D, Raw>): Field<T, OmitInit, D, Raw>;
export declare const field: typeof _field;
export {};
//# sourceMappingURL=factory.d.ts.map