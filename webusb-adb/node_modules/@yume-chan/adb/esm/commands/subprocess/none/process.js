import { PromiseResolver } from "@yume-chan/async";
export class AdbNoneProtocolProcessImpl {
    #socket;
    get stdin() {
        return this.#socket.writable;
    }
    get output() {
        return this.#socket.readable;
    }
    #exited;
    get exited() {
        return this.#exited;
    }
    constructor(socket, signal) {
        this.#socket = socket;
        if (signal) {
            // `signal` won't affect `this.output`
            // So remaining data can still be read
            // (call `controller.error` will discard all pending data)
            const exited = new PromiseResolver();
            this.#socket.closed.then(() => exited.resolve(undefined), (e) => exited.reject(e));
            signal.addEventListener("abort", () => {
                exited.reject(signal.reason);
                this.#socket.close();
            });
            this.#exited = exited.promise;
        }
        else {
            this.#exited = this.#socket.closed;
        }
    }
    kill() {
        return this.#socket.close();
    }
}
//# sourceMappingURL=process.js.map