import type { ReadableWritablePair } from "@yume-chan/stream-extra";
import { Consumable } from "@yume-chan/stream-extra";
import type { AdbIncomingSocketHandler, AdbSocket, Closeable } from "../adb.js";
import type { AdbPacketData, AdbPacketInit } from "./packet.js";
import { AdbCommand } from "./packet.js";
export interface AdbPacketDispatcherOptions {
    /**
     * From Android 9.0, ADB stopped checking the checksum in packet header to improve performance.
     *
     * The value should be inferred from the device's ADB protocol version.
     */
    calculateChecksum: boolean;
    /**
     * Before Android 9.0, ADB uses `char*` to parse service strings,
     * thus requires a null character to terminate.
     *
     * The value should be inferred from the device's ADB protocol version.
     * Usually it should have the same value as `calculateChecksum`, since they both changed
     * in Android 9.0.
     */
    appendNullToServiceString: boolean;
    maxPayloadSize: number;
    /**
     * Whether to keep the `connection` open (don't call `writable.close` and `readable.cancel`)
     * when `AdbPacketDispatcher.close` is called.
     *
     * @default false
     */
    preserveConnection?: boolean | undefined;
    /**
     * The number of bytes the device can send before receiving an ack packet.
     * Using delayed ack can improve the throughput,
     * especially when the device is connected over Wi-Fi (so the latency is higher).
     *
     * This must be the negotiated value between the client and device. If the device enabled
     * delayed ack but the client didn't, the device will throw an error when the client sends
     * the first `WRTE` packet. And vice versa.
     */
    initialDelayedAckBytes: number;
    /**
     * When set, the dispatcher will throw an error when
     * one of the socket readable stalls for this amount of milliseconds.
     *
     * Because ADB is a multiplexed protocol, blocking one socket will also block all other sockets.
     * It's important to always read from all sockets to prevent stalling.
     *
     * This option is helpful to detect bugs in the client code.
     *
     * @default false
     */
    readTimeLimit?: number | undefined;
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
    #private;
    readonly options: AdbPacketDispatcherOptions;
    get disconnected(): Promise<void>;
    constructor(connection: ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>>, options: AdbPacketDispatcherOptions);
    createSocket(service: string): Promise<AdbSocket>;
    addReverseTunnel(service: string, handler: AdbIncomingSocketHandler): void;
    removeReverseTunnel(address: string): void;
    clearReverseTunnels(): void;
    sendPacket(command: AdbCommand, arg0: number, arg1: number, payload: string | Uint8Array): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=dispatcher.d.ts.map