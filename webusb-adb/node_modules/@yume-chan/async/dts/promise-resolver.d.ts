export type PromiseResolverState = 'running' | 'resolved' | 'rejected';
export declare class PromiseResolver<T> {
    #private;
    get promise(): Promise<T>;
    get state(): PromiseResolverState;
    constructor();
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
//# sourceMappingURL=promise-resolver.d.ts.map