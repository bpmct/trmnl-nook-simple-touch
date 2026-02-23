import { PromiseResolver } from "./promise-resolver";
var AsyncOperationManager = (function () {
    function AsyncOperationManager(startId) {
        if (startId === void 0) { startId = 0; }
        this.pendingResolvers = new Map();
        this.nextId = startId;
    }
    AsyncOperationManager.prototype.add = function () {
        var id = this.nextId++;
        var resolver = new PromiseResolver();
        this.pendingResolvers.set(id, resolver);
        return [id, resolver.promise];
    };
    AsyncOperationManager.prototype.getResolver = function (id) {
        if (!this.pendingResolvers.has(id)) {
            return null;
        }
        var resolver = this.pendingResolvers.get(id);
        this.pendingResolvers.delete(id);
        return resolver;
    };
    AsyncOperationManager.prototype.resolve = function (id, result) {
        var resolver = this.getResolver(id);
        if (resolver !== null) {
            resolver.resolve(result);
            return true;
        }
        return false;
    };
    AsyncOperationManager.prototype.reject = function (id, reason) {
        var resolver = this.getResolver(id);
        if (resolver !== null) {
            resolver.reject(reason);
            return true;
        }
        return false;
    };
    return AsyncOperationManager;
}());
export { AsyncOperationManager };
//# sourceMappingURL=async-operation-manager.js.map