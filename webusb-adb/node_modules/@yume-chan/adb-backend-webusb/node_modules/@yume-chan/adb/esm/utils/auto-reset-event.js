import { PromiseResolver } from "@yume-chan/async";
export class AutoResetEvent {
    _set;
    _queue = [];
    constructor(initialSet = false) {
        this._set = initialSet;
    }
    wait() {
        if (!this._set) {
            this._set = true;
            if (this._queue.length === 0) {
                return Promise.resolve();
            }
        }
        const resolver = new PromiseResolver();
        this._queue.push(resolver);
        return resolver.promise;
    }
    notifyOne() {
        if (this._queue.length !== 0) {
            this._queue.pop().resolve();
        }
        else {
            this._set = false;
        }
    }
    dispose() {
        for (const item of this._queue) {
            item.reject(new Error("The AutoResetEvent has been disposed"));
        }
        this._queue.length = 0;
    }
}
//# sourceMappingURL=auto-reset-event.js.map