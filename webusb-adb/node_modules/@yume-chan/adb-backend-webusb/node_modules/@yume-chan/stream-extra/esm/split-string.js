import { TransformStream } from "./stream.js";
function* split(input, separator) {
    let start = 0;
    while (true) {
        const index = input.indexOf(separator, start);
        if (index === -1) {
            return;
        }
        const part = input.substring(start, index);
        yield part;
        start = index + 1;
    }
}
export class SplitStringStream extends TransformStream {
    constructor(separator) {
        super({
            transform(chunk, controller) {
                for (const part of split(chunk, separator)) {
                    controller.enqueue(part);
                }
            },
        });
    }
}
//# sourceMappingURL=split-string.js.map