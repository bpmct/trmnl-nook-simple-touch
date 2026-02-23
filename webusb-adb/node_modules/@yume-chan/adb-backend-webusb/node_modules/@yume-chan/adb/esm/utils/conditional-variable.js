import { PromiseResolver } from "@yume-chan/async";
export class ConditionalVariable {
    _locked = false;
    _queue = [];
    wait(condition) {
        if (!this._locked) {
            this._locked = true;
            if (this._queue.length === 0 && condition()) {
                return Promise.resolve();
            }
        }
        const resolver = new PromiseResolver();
        this._queue.push({ condition, resolver });
        return resolver.promise;
    }
    notifyOne() {
        const entry = this._queue.shift();
        if (entry) {
            if (entry.condition()) {
                entry.resolver.resolve();
            }
        }
        else {
            this._locked = false;
        }
    }
    dispose() {
        for (const item of this._queue) {
            item.resolver.reject(new Error("The ConditionalVariable has been disposed"));
        }
        this._queue.length = 0;
    }
}
//# sourceMappingURL=conditional-variable.js.map