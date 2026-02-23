import { TransformStream } from "./stream.js";
export declare class InspectStream<T> extends TransformStream<T, T> {
    constructor(callback: (value: T) => void);
}
//# sourceMappingURL=inspect.d.ts.map