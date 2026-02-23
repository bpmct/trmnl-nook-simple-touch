import { BufferLikeFieldDefinition } from "./base.js";
export class FixedLengthBufferLikeFieldDefinition extends BufferLikeFieldDefinition {
    getSize() {
        return this.options.length;
    }
}
//# sourceMappingURL=fixed-length.js.map