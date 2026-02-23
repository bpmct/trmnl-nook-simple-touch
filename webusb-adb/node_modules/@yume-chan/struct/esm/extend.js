import { struct } from "./struct.js";
/* #__NO_SIDE_EFFECTS__ */
export function extend(base, fields, options) {
    return struct(Object.assign({}, base.fields, fields), {
        littleEndian: options?.littleEndian ?? base.littleEndian,
        extra: base.extra,
        postDeserialize: options?.postDeserialize,
    });
}
//# sourceMappingURL=extend.js.map