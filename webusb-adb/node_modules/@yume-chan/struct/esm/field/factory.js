import { bipedal } from "../bipedal.js";
import { byobFieldSerializer, defaultFieldSerializer } from "./serialize.js";
/* #__NO_SIDE_EFFECTS__ */
// eslint-disable-next-line @typescript-eslint/max-params
function _field(size, type, serialize, deserialize, options) {
    const field = {
        size,
        type: type,
        serialize: type === "default"
            ? defaultFieldSerializer(serialize)
            : byobFieldSerializer(size, serialize),
        deserialize: bipedal(deserialize),
        omitInit: options?.omitInit,
    };
    if (options?.init) {
        field.init = options.init;
    }
    return field;
}
export const field = _field;
//# sourceMappingURL=factory.js.map