import { Consumable } from "../consumable.js";
export function getValue(value) {
    return value instanceof Consumable ? value.value : value;
}
export function tryConsume(value, callback) {
    if (value instanceof Consumable) {
        return value.tryConsume(callback);
    }
    else {
        return callback(value);
    }
}
//# sourceMappingURL=utils.js.map