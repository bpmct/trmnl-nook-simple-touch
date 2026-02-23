export const SyncPromise = {
    reject(reason) {
        return new RejectedSyncPromise(reason);
    },
    resolve(value) {
        if (typeof value === "object" &&
            value !== null &&
            typeof value.then === "function") {
            if (value instanceof PendingSyncPromise ||
                value instanceof ResolvedSyncPromise ||
                value instanceof RejectedSyncPromise) {
                return value;
            }
            return new PendingSyncPromise(value);
        }
        else {
            return new ResolvedSyncPromise(value);
        }
    },
    try(executor) {
        try {
            return SyncPromise.resolve(executor());
        }
        catch (e) {
            return SyncPromise.reject(e);
        }
    },
};
class PendingSyncPromise {
    promise;
    constructor(promise) {
        this.promise = promise;
    }
    then(onfulfilled, onrejected) {
        return new PendingSyncPromise(this.promise.then(onfulfilled, onrejected));
    }
    valueOrPromise() {
        return this.promise;
    }
}
class ResolvedSyncPromise {
    value;
    constructor(value) {
        this.value = value;
    }
    then(onfulfilled) {
        if (!onfulfilled) {
            return this;
        }
        return SyncPromise.try(() => onfulfilled(this.value));
    }
    valueOrPromise() {
        return this.value;
    }
}
class RejectedSyncPromise {
    reason;
    constructor(reason) {
        this.reason = reason;
    }
    then(onfulfilled, onrejected) {
        if (!onrejected) {
            return this;
        }
        return SyncPromise.try(() => onrejected(this.reason));
    }
    valueOrPromise() {
        throw this.reason;
    }
}
//# sourceMappingURL=sync-promise.js.map