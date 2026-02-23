import { isPromiseLike } from "@yume-chan/async";
function advance(iterator, next) {
    while (true) {
        const { done, value } = iterator.next(next);
        if (done) {
            return value;
        }
        if (isPromiseLike(value)) {
            return value.then((value) => advance(iterator, { resolved: value }), (error) => advance(iterator, { error }));
        }
        next = value;
    }
}
/* #__NO_SIDE_EFFECTS__ */
export function bipedal(fn, bindThis) {
    function result(...args) {
        const iterator = fn.call(this, function* (value) {
            if (isPromiseLike(value)) {
                const result = yield value;
                if ("resolved" in result) {
                    return result.resolved;
                }
                else {
                    throw result.error;
                }
            }
            return value;
        }, ...args);
        return advance(iterator, undefined);
    }
    if (bindThis) {
        return result.bind(bindThis);
    }
    else {
        return result;
    }
}
//# sourceMappingURL=bipedal.js.map