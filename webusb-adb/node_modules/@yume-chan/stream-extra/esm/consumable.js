import { PromiseResolver, isPromiseLike } from "@yume-chan/async";
import { ConsumableReadableStream, ConsumableWrapByteReadableStream, ConsumableWrapWritableStream, ConsumableWritableStream, } from "./consumable/index.js";
import { createTask } from "./task.js";
export class Consumable {
    static WritableStream = ConsumableWritableStream;
    static WrapWritableStream = ConsumableWrapWritableStream;
    static ReadableStream = ConsumableReadableStream;
    static WrapByteReadableStream = ConsumableWrapByteReadableStream;
    #task;
    #resolver;
    value;
    consumed;
    constructor(value) {
        this.#task = createTask("Consumable");
        this.value = value;
        this.#resolver = new PromiseResolver();
        this.consumed = this.#resolver.promise;
    }
    consume() {
        this.#resolver.resolve();
    }
    error(error) {
        this.#resolver.reject(error);
    }
    tryConsume(callback) {
        try {
            let result = this.#task.run(() => callback(this.value));
            if (isPromiseLike(result)) {
                result = result.then((value) => {
                    this.#resolver.resolve();
                    return value;
                }, (e) => {
                    this.#resolver.reject(e);
                    throw e;
                });
            }
            else {
                this.#resolver.resolve();
            }
            return result;
        }
        catch (e) {
            this.#resolver.reject(e);
            throw e;
        }
    }
}
//# sourceMappingURL=consumable.js.map