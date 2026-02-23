import { Consumable } from "../consumable.js";
import type { MaybeConsumable } from "../maybe-consumable.js";
export declare function getValue<T>(value: MaybeConsumable<T>): T;
export declare function tryConsume<T, R>(value: T, callback: (value: T extends Consumable<infer U> ? U : T) => R): R;
//# sourceMappingURL=utils.d.ts.map