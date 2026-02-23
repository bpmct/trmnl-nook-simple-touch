import { PromiseResolver } from "@yume-chan/async";
import { MaybeConsumable, PushReadableStream } from "@yume-chan/stream-extra";
import { EmptyUint8Array } from "@yume-chan/struct";
import { AdbCommand } from "./packet.js";
export class AdbDaemonSocketController {
    #dispatcher;
    localId;
    remoteId;
    localCreated;
    service;
    #readable;
    #readableController;
    get readable() {
        return this.#readable;
    }
    #writableController;
    writable;
    #closed = false;
    #closedPromise = new PromiseResolver();
    get closed() {
        return this.#closedPromise.promise;
    }
    #socket;
    get socket() {
        return this.#socket;
    }
    #availableWriteBytesChanged;
    /**
     * When delayed ack is disabled, returns `Infinity` if the socket is ready to write
     * (exactly one packet can be written no matter how large it is), or `-1` if the socket
     * is waiting for ack message.
     *
     * When delayed ack is enabled, returns a non-negative finite number indicates the number of
     * bytes that can be written to the socket before waiting for ack message.
     */
    #availableWriteBytes = 0;
    constructor(options) {
        this.#dispatcher = options.dispatcher;
        this.localId = options.localId;
        this.remoteId = options.remoteId;
        this.localCreated = options.localCreated;
        this.service = options.service;
        this.#readable = new PushReadableStream((controller) => {
            this.#readableController = controller;
        });
        this.writable = new MaybeConsumable.WritableStream({
            start: (controller) => {
                this.#writableController = controller;
                controller.signal.addEventListener("abort", () => {
                    this.#availableWriteBytesChanged?.reject(controller.signal.reason);
                });
            },
            write: async (data) => {
                const size = data.length;
                const chunkSize = this.#dispatcher.options.maxPayloadSize;
                for (let start = 0, end = chunkSize; start < size; start = end, end += chunkSize) {
                    const chunk = data.subarray(start, end);
                    await this.#writeChunk(chunk);
                }
            },
        });
        this.#socket = new AdbDaemonSocket(this);
        this.#availableWriteBytes = options.availableWriteBytes;
    }
    async #writeChunk(data) {
        const length = data.length;
        while (this.#availableWriteBytes < length) {
            // Only one lock is required because Web Streams API guarantees
            // that `write` is not reentrant.
            const resolver = new PromiseResolver();
            this.#availableWriteBytesChanged = resolver;
            await resolver.promise;
        }
        if (this.#availableWriteBytes === Infinity) {
            this.#availableWriteBytes = -1;
        }
        else {
            this.#availableWriteBytes -= length;
        }
        await this.#dispatcher.sendPacket(AdbCommand.Write, this.localId, this.remoteId, data);
    }
    async enqueue(data) {
        await this.#readableController.enqueue(data);
    }
    ack(bytes) {
        this.#availableWriteBytes += bytes;
        this.#availableWriteBytesChanged?.resolve();
    }
    async close() {
        if (this.#closed) {
            return;
        }
        this.#closed = true;
        this.#availableWriteBytesChanged?.reject(new Error("Socket closed"));
        try {
            this.#writableController.error(new Error("Socket closed"));
        }
        catch {
            // ignore
        }
        await this.#dispatcher.sendPacket(AdbCommand.Close, this.localId, this.remoteId, EmptyUint8Array);
    }
    dispose() {
        this.#readableController.close();
        this.#closedPromise.resolve(undefined);
    }
}
/**
 * A duplex stream representing a socket to ADB daemon.
 */
export class AdbDaemonSocket {
    #controller;
    get localId() {
        return this.#controller.localId;
    }
    get remoteId() {
        return this.#controller.remoteId;
    }
    get localCreated() {
        return this.#controller.localCreated;
    }
    get service() {
        return this.#controller.service;
    }
    get readable() {
        return this.#controller.readable;
    }
    get writable() {
        return this.#controller.writable;
    }
    get closed() {
        return this.#controller.closed;
    }
    constructor(controller) {
        this.#controller = controller;
    }
    close() {
        return this.#controller.close();
    }
}
//# sourceMappingURL=socket.js.map