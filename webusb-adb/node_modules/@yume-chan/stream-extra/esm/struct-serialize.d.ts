import type { StructInit, StructSerializer } from "@yume-chan/struct";
import { TransformStream } from "./stream.js";
export declare class StructSerializeStream<T extends StructSerializer<unknown>> extends TransformStream<StructInit<T>, Uint8Array> {
    constructor(struct: T);
}
//# sourceMappingURL=struct-serialize.d.ts.map