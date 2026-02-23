export function delay(time) {
    return new Promise(function (resolve) {
        globalThis.setTimeout(function () { return resolve(); }, time);
    });
}
//# sourceMappingURL=delay.js.map