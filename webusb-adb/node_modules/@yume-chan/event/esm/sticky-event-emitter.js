import { EventEmitter } from "./event-emitter.js";
const Undefined = Symbol("undefined");
export class StickyEventEmitter extends EventEmitter {
    #value = Undefined;
    addEventListener(info) {
        if (this.#value !== Undefined) {
            info.listener.call(info.thisArg, this.#value, ...info.args);
        }
        return super.addEventListener(info);
    }
    fire(e) {
        this.#value = e;
        super.fire(e);
    }
}
//# sourceMappingURL=sticky-event-emitter.js.map