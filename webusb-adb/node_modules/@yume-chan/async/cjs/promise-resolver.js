"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseResolver = void 0;
class PromiseResolver {
    #promise;
    get promise() { return this.#promise; }
    #resolve;
    #reject;
    #state = 'running';
    get state() { return this.#state; }
    constructor() {
        this.#promise = new Promise((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
        });
    }
    resolve = (value) => {
        this.#resolve(value);
        this.#state = 'resolved';
    };
    reject = (reason) => {
        this.#reject(reason);
        this.#state = 'rejected';
    };
}
exports.PromiseResolver = PromiseResolver;
//# sourceMappingURL=promise-resolver.js.map