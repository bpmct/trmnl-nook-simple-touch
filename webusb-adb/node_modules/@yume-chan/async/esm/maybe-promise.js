export function isPromiseLike(value) {
    return typeof value === "object" && value !== null && "then" in value;
}
//# sourceMappingURL=maybe-promise.js.map