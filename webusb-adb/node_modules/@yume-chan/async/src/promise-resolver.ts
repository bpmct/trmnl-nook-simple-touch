export type PromiseResolverState = 'running' | 'resolved' | 'rejected';

export class PromiseResolver<T> {
    #promise: Promise<T>;
    public get promise(): Promise<T> { return this.#promise; }

    #resolve!: (value: T | PromiseLike<T>) => void;
    #reject!: (reason?: any) => void;

    #state: PromiseResolverState = 'running';
    public get state(): PromiseResolverState { return this.#state; }

    public constructor() {
        this.#promise = new Promise<T>((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
        });
    }

    public resolve = (value: T | PromiseLike<T>): void => {
        this.#resolve(value);
        this.#state = 'resolved';
    };

    public reject = (reason?: any): void => {
        this.#reject(reason);
        this.#state = 'rejected';
    };
}
