import { TransformStream } from "./stream.js";
export class StructSerializeStream extends TransformStream {
    constructor(struct) {
        super({
            transform(chunk, controller) {
                controller.enqueue(struct.serialize(chunk));
            },
        });
    }
}
//# sourceMappingURL=struct-serialize.js.map