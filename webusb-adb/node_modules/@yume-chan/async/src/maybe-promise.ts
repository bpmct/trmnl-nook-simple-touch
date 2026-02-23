export type MaybePromise<T> = T | Promise<T>;

export type MaybePromiseLike<T> = T | PromiseLike<T>;

export function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
    return typeof value === "object" && value !== null && "then" in value;
}
