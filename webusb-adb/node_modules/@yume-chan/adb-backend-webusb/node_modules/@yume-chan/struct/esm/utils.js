/**
 * Returns a (fake) value of the given type.
 */
export function placeholder() {
    return undefined;
}
const { TextEncoder, TextDecoder } = globalThis;
const Utf8Encoder = new TextEncoder();
const Utf8Decoder = new TextDecoder();
export function encodeUtf8(input) {
    return Utf8Encoder.encode(input);
}
export function decodeUtf8(buffer) {
    return Utf8Decoder.decode(buffer);
}
//# sourceMappingURL=utils.js.map