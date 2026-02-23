import { PromiseResolver } from "./promise-resolver";

export class AsyncOperationManager {
    private nextId: number;

    private pendingResolvers: Map<number, PromiseResolver<any>> = new Map();

    public constructor(startId: number = 0) {
        this.nextId = startId;
    }

    public add<T>(): [id: number, promise: Promise<T>] {
        const id = this.nextId++;
        const resolver = new PromiseResolver<T>();
        this.pendingResolvers.set(id, resolver);
        return [id, resolver.promise];
    }

    private getResolver(id: number): PromiseResolver<unknown> | null {
        if (!this.pendingResolvers.has(id)) {
            return null;
        }

        const resolver = this.pendingResolvers.get(id)!;
        this.pendingResolvers.delete(id);
        return resolver;
    }

    public resolve<T>(id: number, result: T): boolean {
        const resolver = this.getResolver(id);
        if (resolver !== null) {
            resolver.resolve(result);
            return true;
        }
        return false;
    }

    public reject(id: number, reason: Error): boolean {
        const resolver = this.getResolver(id);
        if (resolver !== null) {
            resolver.reject(reason);
            return true;
        }
        return false;
    }
}
