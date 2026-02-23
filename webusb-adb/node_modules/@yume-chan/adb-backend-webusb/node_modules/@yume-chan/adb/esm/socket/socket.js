import { PromiseResolver } from "@yume-chan/async";
import { ConsumableWritableStream, DistributionStream, DuplexStreamFactory, PushReadableStream, pipeFrom, } from "@yume-chan/stream-extra";
import { AdbCommand } from "../packet.js";
export class AdbSocketController {
    dispatcher;
    localId;
    remoteId;
    localCreated;
    serviceString;
    _duplex;
    _readable;
    _readableController;
    get readable() {
        return this._readable;
    }
    _writePromise;
    writable;
    _closed = false;
    /**
     * Whether the socket is half-closed (i.e. the local side initiated the close).
     *
     * It's only used by dispatcher to avoid sending another `CLSE` packet to remote.
     */
    get closed() {
        return this._closed;
    }
    _socket;
    get socket() {
        return this._socket;
    }
    constructor(options) {
        Object.assign(this, options);
        // Check this image to help you understand the stream graph
        // cspell: disable-next-line
        // https://www.plantuml.com/plantuml/png/TL0zoeGm4ErpYc3l5JxyS0yWM6mX5j4C6p4cxcJ25ejttuGX88ZftizxUKmJI275pGhXl0PP_UkfK_CAz5Z2hcWsW9Ny2fdU4C1f5aSchFVxA8vJjlTPRhqZzDQMRB7AklwJ0xXtX0ZSKH1h24ghoKAdGY23FhxC4nS2pDvxzIvxb-8THU0XlEQJ-ZB7SnXTAvc_LhOckhMdLBnbtndpb-SB7a8q2SRD_W00
        this._duplex = new DuplexStreamFactory({
            close: async () => {
                this._closed = true;
                await this.dispatcher.sendPacket(AdbCommand.Close, this.localId, this.remoteId);
                // Don't `dispose` here, we need to wait for `CLSE` response packet.
                return false;
            },
            dispose: () => {
                // Error out the pending writes
                this._writePromise?.reject(new Error("Socket closed"));
            },
        });
        this._readable = this._duplex.wrapReadable(new PushReadableStream((controller) => {
            this._readableController = controller;
        }, {
            highWaterMark: options.highWaterMark ?? 16 * 1024,
            size(chunk) {
                return chunk.byteLength;
            },
        }));
        this.writable = pipeFrom(this._duplex.createWritable(new ConsumableWritableStream({
            write: async (chunk) => {
                // Wait for an ack packet
                this._writePromise = new PromiseResolver();
                await this.dispatcher.sendPacket(AdbCommand.Write, this.localId, this.remoteId, chunk);
                await this._writePromise.promise;
            },
        })), new DistributionStream(this.dispatcher.options.maxPayloadSize));
        this._socket = new AdbSocket(this);
    }
    async enqueue(data) {
        // Consumer may abort the `ReadableStream` to close the socket,
        // it's OK to throw away further packets in this case.
        if (this._readableController.abortSignal.aborted) {
            return;
        }
        await this._readableController.enqueue(data);
    }
    ack() {
        this._writePromise?.resolve();
    }
    async close() {
        await this._duplex.close();
    }
    dispose() {
        return this._duplex.dispose();
    }
}
/**
 * A duplex stream representing a socket to ADB daemon.
 *
 * To close it, call either `socket.close()`,
 * `socket.readable.cancel()`, `socket.readable.getReader().cancel()`,
 * `socket.writable.abort()`, `socket.writable.getWriter().abort()`,
 * `socket.writable.close()` or `socket.writable.getWriter().close()`.
 */
export class AdbSocket {
    _controller;
    get localId() {
        return this._controller.localId;
    }
    get remoteId() {
        return this._controller.remoteId;
    }
    get localCreated() {
        return this._controller.localCreated;
    }
    get serviceString() {
        return this._controller.serviceString;
    }
    get readable() {
        return this._controller.readable;
    }
    get writable() {
        return this._controller.writable;
    }
    constructor(controller) {
        this._controller = controller;
    }
    close() {
        return this._controller.close();
    }
}
//# sourceMappingURL=socket.js.map