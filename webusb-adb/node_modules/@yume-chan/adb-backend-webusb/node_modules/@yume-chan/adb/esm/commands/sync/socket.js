import { BufferCombiner, BufferedReadableStream, ConsumableWritableStream, } from "@yume-chan/stream-extra";
import { AutoResetEvent } from "../../index.js";
export class AdbSyncSocketLocked {
    _writer;
    _readable;
    _socketLock;
    _writeLock = new AutoResetEvent();
    _combiner;
    constructor(writer, readable, bufferSize, lock) {
        this._writer = writer;
        this._readable = readable;
        this._socketLock = lock;
        this._combiner = new BufferCombiner(bufferSize);
    }
    async writeInnerStream(buffer) {
        await ConsumableWritableStream.write(this._writer, buffer);
    }
    async flush() {
        try {
            await this._writeLock.wait();
            const buffer = this._combiner.flush();
            if (buffer) {
                await this.writeInnerStream(buffer);
            }
        }
        finally {
            this._writeLock.notifyOne();
        }
    }
    async write(data) {
        try {
            await this._writeLock.wait();
            for (const buffer of this._combiner.push(data)) {
                await this.writeInnerStream(buffer);
            }
        }
        finally {
            this._writeLock.notifyOne();
        }
    }
    async read(length) {
        await this.flush();
        return await this._readable.read(length);
    }
    release() {
        this._combiner.flush();
        this._socketLock.notifyOne();
    }
}
export class AdbSyncSocket {
    _lock = new AutoResetEvent();
    _socket;
    _locked;
    constructor(socket, bufferSize) {
        this._socket = socket;
        this._locked = new AdbSyncSocketLocked(socket.writable.getWriter(), new BufferedReadableStream(socket.readable), bufferSize, this._lock);
    }
    async lock() {
        await this._lock.wait();
        return this._locked;
    }
    async close() {
        await this._socket.close();
    }
}
//# sourceMappingURL=socket.js.map