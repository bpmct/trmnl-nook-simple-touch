"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = delay;
function delay(time) {
    return new Promise(resolve => {
        globalThis.setTimeout(() => resolve(), time);
    });
}
//# sourceMappingURL=delay.js.map