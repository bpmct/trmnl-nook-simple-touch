import type { MaybePromiseLike } from "@yume-chan/async";
export type BipedalGenerator<This, T, A extends unknown[]> = (this: This, then: <U>(value: MaybePromiseLike<U>) => Iterable<unknown, U, unknown>, ...args: A) => Generator<unknown, T, unknown>;
export declare function bipedal<This, T, A extends unknown[]>(fn: BipedalGenerator<This, T, A>, bindThis?: This): {
    (this: This, ...args: A): MaybePromiseLike<T>;
};
//# sourceMappingURL=bipedal.d.ts.map