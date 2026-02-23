export declare class AsyncOperationManager {
    private nextId;
    private pendingResolvers;
    constructor(startId?: number);
    add<T>(): [id: number, promise: Promise<T>];
    private getResolver;
    resolve<T>(id: number, result: T): boolean;
    reject(id: number, reason: Error): boolean;
}
//# sourceMappingURL=async-operation-manager.d.ts.map