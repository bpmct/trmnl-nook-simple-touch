// TODO: allow over reading (returning a `Uint8Array`, an `offset` and a `length`) to avoid copying
export class ExactReadableEndedError extends Error {
    constructor() {
        super("ExactReadable ended");
    }
}
export class Uint8ArrayExactReadable {
    #data;
    #position;
    get position() {
        return this.#position;
    }
    constructor(data) {
        this.#data = data;
        this.#position = 0;
    }
    readExactly(length) {
        if (this.#position + length > this.#data.length) {
            throw new ExactReadableEndedError();
        }
        const result = this.#data.subarray(this.#position, this.#position + length);
        this.#position += length;
        return result;
    }
}
//# sourceMappingURL=readable.js.map