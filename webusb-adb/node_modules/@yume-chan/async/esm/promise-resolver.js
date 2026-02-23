export class PromiseResolver {
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
//# sourceMappingURL=promise-resolver.js.map