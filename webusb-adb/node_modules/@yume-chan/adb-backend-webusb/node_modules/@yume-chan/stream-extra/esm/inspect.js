import { TransformStream } from "./stream.js";
export class InspectStream extends TransformStream {
    constructor(callback) {
        super({
            transform(chunk, controller) {
                callback(chunk);
                controller.enqueue(chunk);
            },
        });
    }
}
//# sourceMappingURL=inspect.js.map