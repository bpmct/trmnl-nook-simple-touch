import type { RemoveEventListener } from "@yume-chan/event";
import type { Consumable, ReadableWritablePair } from "@yume-chan/stream-extra";
import type { ValueOrPromise } from "@yume-chan/struct";
import type { AdbPacketData, AdbPacketInit } from "../packet.js";
import { AdbCommand } from "../packet.js";
import type { AdbSocket } from "./socket.js";
export interface AdbPacketDispatcherOptions {
    calculateChecksum: boolean;
    /**
     * Before Android 9.0, ADB uses `char*` to parse service string,
     * thus requires a null character to terminate.
     *
     * Usually it should have the same value as `calculateChecksum`.
     */
    appendNullToServiceString: boolean;
    maxPayloadSize: number;
}
export type AdbIncomingSocketHandler = (socket: AdbSocket) => ValueOrPromise<boolean>;
export interface Closeable {
    close(): ValueOrPromise<void>;
}
/**
 * The dispatcher is the "dumb" part of the connection handling logic.
 *
 * Except some options to change some minor behaviors,
 * its only job is forwarding packets between authenticated underlying streams
 * and abstracted socket objects.
 *
 * The `Adb` class is responsible for doing the authentication,
 * negotiating the options, and has shortcuts to high-level services.
 */
export declare class AdbPacketDispatcher implements Closeable {
    private readonly initializers;
    /**
     * Socket local ID to the socket controller.
     */
    private readonly sockets;
    private _writer;
    readonly options: AdbPacketDispatcherOptions;
    private _closed;
    private _disconnected;
    get disconnected(): Promise<void>;
    private _incomingSocketHandlers;
    private _abortController;
    constructor(connection: ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>>, options: AdbPacketDispatcherOptions);
    private handleOk;
    private handleClose;
    /**
     * Add a handler for incoming socket.
     * @param handler A function to call with new incoming sockets. It must return `true` if it accepts the socket.
     * @returns A function to remove the handler.
     */
    onIncomingSocket(handler: AdbIncomingSocketHandler): RemoveEventListener;
    private handleOpen;
    createSocket(serviceString: string): Promise<AdbSocket>;
    sendPacket(command: AdbCommand, arg0: number, arg1: number, payload?: string | Uint8Array): Promise<void>;
    close(): Promise<void>;
    private dispose;
}
//# sourceMappingURL=dispatcher.d.ts.map