import { PromiseResolver } from "./promise-resolver.js";
export class AsyncOperationManager {
    nextId;
    pendingResolvers = new Map();
    constructor(startId = 0) {
        this.nextId = startId;
    }
    add() {
        const id = this.nextId++;
        const resolver = new PromiseResolver();
        this.pendingResolvers.set(id, resolver);
        return [id, resolver.promise];
    }
    getResolver(id) {
        if (!this.pendingResolvers.has(id)) {
            return null;
        }
        const resolver = this.pendingResolvers.get(id);
        this.pendingResolvers.delete(id);
        return resolver;
    }
    resolve(id, result) {
        const resolver = this.getResolver(id);
        if (resolver !== null) {
            resolver.resolve(result);
            return true;
        }
        return false;
    }
    reject(id, reason) {
        const resolver = this.getResolver(id);
        if (resolver !== null) {
            resolver.reject(reason);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=async-operation-manager.js.map