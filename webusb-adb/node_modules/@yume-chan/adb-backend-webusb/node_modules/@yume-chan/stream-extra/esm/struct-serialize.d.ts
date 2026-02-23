import type Struct from "@yume-chan/struct";
import { TransformStream } from "./stream.js";
export declare class StructSerializeStream<T extends Struct<any, any, any, any>> extends TransformStream<T["TInit"], Uint8Array> {
    constructor(struct: T);
}
//# sourceMappingURL=struct-serialize.d.ts.map