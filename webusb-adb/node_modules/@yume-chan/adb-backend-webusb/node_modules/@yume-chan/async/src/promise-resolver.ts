export type PromiseResolverState = 'running' | 'resolved' | 'rejected';

export class PromiseResolver<T> {
    private _promise: Promise<T>;
    public get promise(): Promise<T> { return this._promise; }

    private _resolve!: (value: T | PromiseLike<T>) => void;
    private _reject!: (reason?: any) => void;

    private _state: PromiseResolverState = 'running';
    public get state(): PromiseResolverState { return this._state; }

    public constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public resolve = (value: T | PromiseLike<T>): void => {
        this._resolve(value);
        this._state = 'resolved';
    };

    public reject = (reason?: any): void => {
        this._reject(reason);
        this._state = 'rejected';
    };
}
