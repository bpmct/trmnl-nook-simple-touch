import type { StructDeserializer } from "@yume-chan/struct";
import { BufferedTransformStream } from "./buffered-transform.js";
export declare class StructDeserializeStream<T> extends BufferedTransformStream<T> {
    constructor(struct: StructDeserializer<T>);
}
//# sourceMappingURL=struct-deserialize.d.ts.map