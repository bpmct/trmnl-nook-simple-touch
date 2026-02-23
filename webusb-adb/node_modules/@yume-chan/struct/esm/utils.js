// This library can't use `@types/node` or `lib: dom`
// because they will pollute the global scope
// So `TextEncoder` and `TextDecoder` types are not available
export const { TextEncoder, TextDecoder } = globalThis;
const SharedEncoder = /* #__PURE__ */ new TextEncoder();
const SharedDecoder = /* #__PURE__ */ new TextDecoder();
/* #__NO_SIDE_EFFECTS__ */
export function encodeUtf8(input) {
    return SharedEncoder.encode(input);
}
/* #__NO_SIDE_EFFECTS__ */
export function decodeUtf8(buffer) {
    // `TextDecoder` has internal states in stream mode,
    // but this method is not for stream mode, so the instance can be reused
    return SharedDecoder.decode(buffer);
}
//# sourceMappingURL=utils.js.map