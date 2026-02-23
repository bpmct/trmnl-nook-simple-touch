import { buffer } from "./buffer.js";
import { decodeUtf8, encodeUtf8 } from "./utils.js";
// Prettier will move the annotation and make it invalid
// prettier-ignore
export const string = ( /* #__NO_SIDE_EFFECTS__ */(lengthOrField) => {
    const field = buffer(lengthOrField, {
        convert: decodeUtf8,
        back: encodeUtf8,
    });
    field.as = () => field;
    return field;
});
//# sourceMappingURL=string.js.map