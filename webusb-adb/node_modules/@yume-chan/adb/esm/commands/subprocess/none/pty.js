import { MaybeConsumable } from "@yume-chan/stream-extra";
export class AdbNoneProtocolPtyProcess {
    #socket;
    #writer;
    #input;
    get input() {
        return this.#input;
    }
    get output() {
        return this.#socket.readable;
    }
    get exited() {
        return this.#socket.closed;
    }
    constructor(socket) {
        this.#socket = socket;
        this.#writer = this.#socket.writable.getWriter();
        this.#input = new MaybeConsumable.WritableStream({
            write: (chunk) => this.#writer.write(chunk),
        });
    }
    sigint() {
        return this.#writer.write(new Uint8Array([0x03]));
    }
    kill() {
        return this.#socket.close();
    }
}
//# sourceMappingURL=pty.js.map