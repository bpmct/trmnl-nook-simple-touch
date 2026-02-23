import type { StructAsyncDeserializeStream, StructDeserializeStream, StructOptions, StructValue } from "../basic/index.js";
import { StructFieldDefinition, StructFieldValue } from "../basic/index.js";
type DataViewBigInt64Getter = (dataView: DataView, byteOffset: number, littleEndian: boolean | undefined) => bigint;
type DataViewBigInt64Setter = (dataView: DataView, byteOffset: number, value: bigint, littleEndian: boolean | undefined) => void;
export declare class BigIntFieldType {
    readonly TTypeScriptType: bigint;
    readonly size: number;
    readonly getter: DataViewBigInt64Getter;
    readonly setter: DataViewBigInt64Setter;
    constructor(size: number, getter: DataViewBigInt64Getter, setter: DataViewBigInt64Setter);
    static readonly Int64: BigIntFieldType;
    static readonly Uint64: BigIntFieldType;
}
export declare class BigIntFieldDefinition<TType extends BigIntFieldType = BigIntFieldType, TTypeScriptType = TType["TTypeScriptType"]> extends StructFieldDefinition<void, TTypeScriptType> {
    readonly type: TType;
    constructor(type: TType, typescriptType?: TTypeScriptType);
    getSize(): number;
    create(options: Readonly<StructOptions>, struct: StructValue, value: TTypeScriptType): BigIntFieldValue<this>;
    deserialize(options: Readonly<StructOptions>, stream: StructDeserializeStream, struct: StructValue): BigIntFieldValue<this>;
    deserialize(options: Readonly<StructOptions>, stream: StructAsyncDeserializeStream, struct: StructValue): Promise<BigIntFieldValue<this>>;
}
export declare class BigIntFieldValue<TDefinition extends BigIntFieldDefinition<BigIntFieldType, any>> extends StructFieldValue<TDefinition> {
    serialize(dataView: DataView, offset: number): void;
}
export {};
//# sourceMappingURL=bigint.d.ts.map