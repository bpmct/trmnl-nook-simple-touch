import type { ExtraToIntersection, FieldsValue, Struct, StructFields } from "./struct.js";
export declare function extend<Base extends Struct<StructFields, Record<PropertyKey, unknown> | undefined, unknown>, Fields extends StructFields, PostDeserialize = FieldsValue<Base["fields"] & Fields> & ExtraToIntersection<Base["extra"]>>(base: Base, fields: Fields, options?: {
    littleEndian?: boolean | undefined;
    postDeserialize?: (this: FieldsValue<Base["fields"] & Fields> & ExtraToIntersection<Base["extra"]>, value: FieldsValue<Base["fields"] & Fields> & ExtraToIntersection<Base["extra"]>) => PostDeserialize;
}): Struct<Base["fields"] & Fields, Base["extra"], PostDeserialize>;
//# sourceMappingURL=extend.d.ts.map