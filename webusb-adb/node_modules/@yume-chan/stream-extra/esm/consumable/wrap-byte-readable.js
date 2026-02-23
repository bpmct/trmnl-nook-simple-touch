import { ReadableStream } from "../stream.js";
import { ConsumableReadableStream } from "./readable.js";
export class ConsumableWrapByteReadableStream extends ReadableStream {
    constructor(stream, chunkSize, min) {
        const reader = stream.getReader({ mode: "byob" });
        let array = new Uint8Array(chunkSize);
        super({
            async pull(controller) {
                const { done, value } = await reader.read(array, { min });
                if (done) {
                    controller.close();
                    return;
                }
                await ConsumableReadableStream.enqueue(controller, value);
                array = new Uint8Array(value.buffer);
            },
            cancel(reason) {
                return reader.cancel(reason);
            },
        });
    }
}
//# sourceMappingURL=wrap-byte-readable.js.map