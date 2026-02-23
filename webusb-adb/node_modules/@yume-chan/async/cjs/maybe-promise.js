"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = isPromiseLike;
function isPromiseLike(value) {
    return typeof value === "object" && value !== null && "then" in value;
}
//# sourceMappingURL=maybe-promise.js.map