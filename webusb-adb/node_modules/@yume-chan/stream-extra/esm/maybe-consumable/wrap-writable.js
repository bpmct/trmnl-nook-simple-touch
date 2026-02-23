import { WritableStream } from "../stream.js";
import { tryConsume } from "./utils.js";
export class MaybeConsumableWrapWritableStream extends WritableStream {
    constructor(stream) {
        const writer = stream.getWriter();
        super({
            write(chunk) {
                return tryConsume(chunk, (chunk) => writer.write(chunk));
            },
            abort(reason) {
                return writer.abort(reason);
            },
            close() {
                return writer.close();
            },
        });
    }
}
//# sourceMappingURL=wrap-writable.js.map