import { WritableStream } from "../stream.js";
export class ConsumableWrapWritableStream extends WritableStream {
    constructor(stream) {
        const writer = stream.getWriter();
        super({
            write(chunk) {
                return chunk.tryConsume((chunk) => writer.write(chunk));
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