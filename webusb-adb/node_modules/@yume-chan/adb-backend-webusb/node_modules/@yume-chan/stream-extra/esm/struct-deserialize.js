import { BufferedTransformStream } from "./buffered-transform.js";
export class StructDeserializeStream extends BufferedTransformStream {
    constructor(struct) {
        super((stream) => {
            return struct.deserialize(stream);
        });
    }
}
//# sourceMappingURL=struct-deserialize.js.map