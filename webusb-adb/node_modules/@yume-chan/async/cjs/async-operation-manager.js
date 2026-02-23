"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncOperationManager = void 0;
const promise_resolver_js_1 = require("./promise-resolver.js");
class AsyncOperationManager {
    nextId;
    pendingResolvers = new Map();
    constructor(startId = 0) {
        this.nextId = startId;
    }
    add() {
        const id = this.nextId++;
        const resolver = new promise_resolver_js_1.PromiseResolver();
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
exports.AsyncOperationManager = AsyncOperationManager;
//# sourceMappingURL=async-operation-manager.js.map