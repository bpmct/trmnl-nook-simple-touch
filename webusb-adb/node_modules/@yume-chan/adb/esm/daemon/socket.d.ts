import type { Disposable } from "@yume-chan/event";
import type { ReadableStream, WritableStream } from "@yume-chan/stream-extra";
import { MaybeConsumable } from "@yume-chan/stream-extra";
import type { AdbSocket } from "../adb.js";
import type { AdbPacketDispatcher } from "./dispatcher.js";
export interface AdbDaemonSocketInfo {
    localId: number;
    remoteId: number;
    localCreated: boolean;
    service: string;
}
export interface AdbDaemonSocketInit extends AdbDaemonSocketInfo {
    dispatcher: AdbPacketDispatcher;
    highWaterMark?: number | undefined;
    /**
     * The initial delayed ack byte count, or `Infinity` if delayed ack is disabled.
     */
    availableWriteBytes: number;
}
export declare class AdbDaemonSocketController implements AdbDaemonSocketInfo, AdbSocket, Disposable {
    #private;
    readonly localId: number;
    readonly remoteId: number;
    readonly localCreated: boolean;
    readonly service: string;
    get readable(): ReadableStream<Uint8Array<ArrayBufferLike>>;
    readonly writable: WritableStream<MaybeConsumable<Uint8Array>>;
    get closed(): Promise<undefined>;
    get socket(): AdbDaemonSocket;
    constructor(options: AdbDaemonSocketInit);
    enqueue(data: Uint8Array): Promise<void>;
    ack(bytes: number): void;
    close(): Promise<void>;
    dispose(): void;
}
/**
 * A duplex stream representing a socket to ADB daemon.
 */
export declare class AdbDaemonSocket implements AdbDaemonSocketInfo, AdbSocket {
    #private;
    get localId(): number;
    get remoteId(): number;
    get localCreated(): boolean;
    get service(): string;
    get readable(): ReadableStream<Uint8Array>;
    get writable(): WritableStream<MaybeConsumable<Uint8Array>>;
    get closed(): Promise<undefined>;
    constructor(controller: AdbDaemonSocketController);
    close(): Promise<void>;
}
//# sourceMappingURL=socket.d.ts.map