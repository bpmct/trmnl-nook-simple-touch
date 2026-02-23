export interface SyncPromise<T> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): SyncPromise<TResult1 | TResult2>;
    valueOrPromise(): T | PromiseLike<T>;
}
interface SyncPromiseStatic {
    reject<T = never>(reason?: any): SyncPromise<T>;
    resolve(): SyncPromise<void>;
    resolve<T>(value: T | PromiseLike<T>): SyncPromise<T>;
    try<T>(executor: () => T | PromiseLike<T>): SyncPromise<T>;
}
export declare const SyncPromise: SyncPromiseStatic;
export {};
//# sourceMappingURL=sync-promise.d.ts.map