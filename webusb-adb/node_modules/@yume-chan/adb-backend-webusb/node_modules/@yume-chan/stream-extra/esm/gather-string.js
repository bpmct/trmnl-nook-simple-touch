import { WritableStream } from "./stream.js";
export class GatherStringStream extends WritableStream {
    // PERF: rope (concat strings) is faster than `[].join('')`
    _result = "";
    get result() {
        return this._result;
    }
    constructor() {
        super({
            write: (chunk) => {
                this._result += chunk;
            },
        });
    }
}
//# sourceMappingURL=gather-string.js.map