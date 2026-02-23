export function delay(time) {
    return new Promise(resolve => {
        globalThis.setTimeout(() => resolve(), time);
    });
}
//# sourceMappingURL=delay.js.map