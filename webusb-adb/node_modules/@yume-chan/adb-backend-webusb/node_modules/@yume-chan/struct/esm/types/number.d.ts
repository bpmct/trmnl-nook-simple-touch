import type { StructAsyncDeserializeStream, StructDeserializeStream, StructOptions, StructValue } from "../basic/index.js";
import { StructFieldDefinition, StructFieldValue } from "../basic/index.js";
export interface NumberFieldType {
    signed: boolean;
    size: number;
    deserialize(array: Uint8Array, littleEndian: boolean): number;
    serialize(dataView: DataView, offset: number, value: number, littleEndian: boolean): void;
}
export declare namespace NumberFieldType {
    const Uint8: NumberFieldType;
    const Int8: NumberFieldType;
    const Uint16: NumberFieldType;
    const Int16: NumberFieldType;
    const Uint32: NumberFieldType;
    const Int32: NumberFieldType;
}
export declare class NumberFieldDefinition<TType extends NumberFieldType = NumberFieldType, TTypeScriptType = number> extends StructFieldDefinition<void, TTypeScriptType> {
    readonly type: TType;
    constructor(type: TType, typescriptType?: TTypeScriptType);
    getSize(): number;
    create(options: Readonly<StructOptions>, struct: StructValue, value: TTypeScriptType): NumberFieldValue<this>;
    deserialize(options: Readonly<StructOptions>, stream: StructDeserializeStream, struct: StructValue): NumberFieldValue<this>;
    deserialize(options: Readonly<StructOptions>, stream: StructAsyncDeserializeStream, struct: StructValue): Promise<NumberFieldValue<this>>;
}
export declare class NumberFieldValue<TDefinition extends NumberFieldDefinition<NumberFieldType, any>> extends StructFieldValue<TDefinition> {
    serialize(dataView: DataView, offset: number): void;
}
//# sourceMappingURL=number.d.ts.map