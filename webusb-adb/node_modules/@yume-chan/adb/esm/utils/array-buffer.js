export function toLocalUint8Array(value) {
    if (value.buffer instanceof ArrayBuffer) {
        return value;
    }
    const copy = new Uint8Array(value.length);
    copy.set(value);
    return copy;
}
//# sourceMappingURL=array-buffer.js.map