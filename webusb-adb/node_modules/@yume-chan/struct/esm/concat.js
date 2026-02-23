import { struct } from "./struct.js";
/* #__NO_SIDE_EFFECTS__ */
export function concat(options, ...structs) {
    return struct(structs.reduce((fields, struct) => Object.assign(fields, struct.fields), {}), {
        littleEndian: options.littleEndian,
        postDeserialize: options.postDeserialize,
        extra: structs.reduce((extras, struct) => Object.defineProperties(extras, Object.getOwnPropertyDescriptors(struct.extra)), {}),
    });
}
//# sourceMappingURL=concat.js.map