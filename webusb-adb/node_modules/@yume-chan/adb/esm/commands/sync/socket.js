import { BufferCombiner, BufferedReadableStream, Consumable, } from "@yume-chan/stream-extra";
import { AutoResetEvent } from "../../utils/index.js";
export class AdbSyncSocketLocked {
    #writer;
    #readable;
    #socketLock;
    #writeLock = new AutoResetEvent();
    #combiner;
    get position() {
        return this.#readable.position;
    }
    constructor(writer, readable, bufferSize, lock) {
        this.#writer = writer;
        this.#readable = readable;
        this.#socketLock = lock;
        this.#combiner = new BufferCombiner(bufferSize);
    }
    #write(buffer) {
        // `#combiner` will reuse the buffer, so we need to use the Consumable pattern
        return Consumable.WritableStream.write(this.#writer, buffer);
    }
    async flush() {
        try {
            await this.#writeLock.wait();
            const buffer = this.#combiner.flush();
            if (buffer) {
                await this.#write(buffer);
            }
        }
        finally {
            this.#writeLock.notifyOne();
        }
    }
    async write(data) {
        try {
            await this.#writeLock.wait();
            for (const buffer of this.#combiner.push(data)) {
                await this.#write(buffer);
            }
        }
        finally {
            this.#writeLock.notifyOne();
        }
    }
    async readExactly(length) {
        // The request may still be in the internal buffer.
        // Call `flush` to send it before starting reading
        await this.flush();
        return await this.#readable.readExactly(length);
    }
    release() {
        // In theory, the writer shouldn't leave anything in the buffer,
        // but to be safe, call `flush` to throw away any remaining data.
        this.#combiner.flush();
        this.#socketLock.notifyOne();
    }
    async close() {
        await this.#readable.cancel();
    }
}
export class AdbSyncSocket {
    #lock = new AutoResetEvent();
    #socket;
    #locked;
    constructor(socket, bufferSize) {
        this.#socket = socket;
        this.#locked = new AdbSyncSocketLocked(socket.writable.getWriter(), new BufferedReadableStream(socket.readable), bufferSize, this.#lock);
    }
    async lock() {
        await this.#lock.wait();
        return this.#locked;
    }
    async close() {
        await this.#locked.close();
        await this.#socket.close();
    }
}
//# sourceMappingURL=socket.js.map