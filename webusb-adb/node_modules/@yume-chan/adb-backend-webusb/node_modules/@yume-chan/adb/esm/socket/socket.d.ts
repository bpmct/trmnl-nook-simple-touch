import type { Disposable } from "@yume-chan/event";
import type { Consumable, ReadableStream, ReadableWritablePair, WritableStream } from "@yume-chan/stream-extra";
import type { AdbPacketDispatcher, Closeable } from "./dispatcher.js";
export interface AdbSocketInfo {
    localId: number;
    remoteId: number;
    localCreated: boolean;
    serviceString: string;
}
export interface AdbSocketConstructionOptions extends AdbSocketInfo {
    dispatcher: AdbPacketDispatcher;
    highWaterMark?: number | undefined;
}
export declare class AdbSocketController implements AdbSocketInfo, ReadableWritablePair<Uint8Array, Consumable<Uint8Array>>, Closeable, Disposable {
    private readonly dispatcher;
    readonly localId: number;
    readonly remoteId: number;
    readonly localCreated: boolean;
    readonly serviceString: string;
    private _duplex;
    private _readable;
    private _readableController;
    get readable(): ReadableStream<Uint8Array>;
    private _writePromise;
    readonly writable: WritableStream<Consumable<Uint8Array>>;
    private _closed;
    /**
     * Whether the socket is half-closed (i.e. the local side initiated the close).
     *
     * It's only used by dispatcher to avoid sending another `CLSE` packet to remote.
     */
    get closed(): boolean;
    private _socket;
    get socket(): AdbSocket;
    constructor(options: AdbSocketConstructionOptions);
    enqueue(data: Uint8Array): Promise<void>;
    ack(): void;
    close(): Promise<void>;
    dispose(): Promise<void>;
}
/**
 * A duplex stream representing a socket to ADB daemon.
 *
 * To close it, call either `socket.close()`,
 * `socket.readable.cancel()`, `socket.readable.getReader().cancel()`,
 * `socket.writable.abort()`, `socket.writable.getWriter().abort()`,
 * `socket.writable.close()` or `socket.writable.getWriter().close()`.
 */
export declare class AdbSocket implements AdbSocketInfo, ReadableWritablePair<Uint8Array, Consumable<Uint8Array>> {
    private _controller;
    get localId(): number;
    get remoteId(): number;
    get localCreated(): boolean;
    get serviceString(): string;
    get readable(): ReadableStream<Uint8Array>;
    get writable(): WritableStream<Consumable<Uint8Array>>;
    constructor(controller: AdbSocketController);
    close(): Promise<void>;
}
//# sourceMappingURL=socket.d.ts.map