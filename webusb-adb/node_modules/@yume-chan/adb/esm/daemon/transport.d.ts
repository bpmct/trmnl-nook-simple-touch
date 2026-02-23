import type { MaybePromiseLike } from "@yume-chan/async";
import type { ReadableWritablePair } from "@yume-chan/stream-extra";
import { Consumable } from "@yume-chan/stream-extra";
import type { AdbIncomingSocketHandler, AdbSocket, AdbTransport } from "../adb.js";
import { AdbBanner } from "../banner.js";
import { AdbFeature } from "../features.js";
import type { AdbAuthenticator, AdbCredentialStore } from "./auth.js";
import type { AdbPacketData, AdbPacketInit } from "./packet.js";
export declare const ADB_DAEMON_VERSION_OMIT_CHECKSUM = 16777217;
export declare const ADB_DAEMON_DEFAULT_FEATURES: readonly AdbFeature[];
export declare const ADB_DAEMON_DEFAULT_INITIAL_PAYLOAD_SIZE: number;
export type AdbDaemonConnection = ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>>;
export interface AdbDaemonAuthenticationOptions {
    serial: string;
    connection: AdbDaemonConnection;
    credentialStore: AdbCredentialStore;
    authenticators?: readonly AdbAuthenticator[];
    features?: readonly AdbFeature[];
    /**
     * The number of bytes the device can send before receiving an ack packet.
     * Using delayed ack can improve the throughput,
     * especially when the device is connected over Wi-Fi (so the latency is higher).
     *
     * Set to 0 or any negative value to disable delayed ack in handshake.
     * Otherwise the value must be in the range of unsigned 32-bit integer.
     *
     * Delayed ack was added in Android 14,
     * this option will be ignored when the device doesn't support it.
     *
     * @default ADB_DAEMON_DEFAULT_INITIAL_PAYLOAD_SIZE
     */
    initialDelayedAckBytes?: number;
    /**
     * Whether to keep the `connection` open (don't call `writable.close` and `readable.cancel`)
     * when `AdbDaemonTransport.close` is called.
     *
     * Note that when `authenticate` fails,
     * no matter which value this option has,
     * the `connection` is always kept open, so it can be used in another `authenticate` call.
     *
     * @default false
     */
    preserveConnection?: boolean | undefined;
    /**
     * When set, the transport will throw an error when
     * one of the socket readable stalls for this amount of milliseconds.
     *
     * Because ADB is a multiplexed protocol, blocking one socket will also block all other sockets.
     * It's important to always read from all sockets to prevent stalling.
     *
     * This option is helpful to detect bugs in the client code.
     *
     * @default undefined
     */
    readTimeLimit?: number | undefined;
}
interface AdbDaemonSocketConnectorConstructionOptions {
    serial: string;
    connection: AdbDaemonConnection;
    version: number;
    maxPayloadSize: number;
    banner: string;
    features?: readonly AdbFeature[];
    /**
     * The number of bytes the device can send before receiving an ack packet.
     *
     * On Android 14 and newer, the Delayed Acknowledgement feature is added to
     * improve performance, especially for high-latency connections like ADB over Wi-Fi.
     *
     * When `features` doesn't include `AdbFeature.DelayedAck`, it must be set to 0. Otherwise,
     * the value must be in the range of unsigned 32-bit integer.
     *
     * If the device enabled delayed ack but the client didn't, the device will throw an error
     * when the client sends the first data packet. And vice versa.
     */
    initialDelayedAckBytes: number;
    /**
     * Whether to keep the `connection` open (don't call `writable.close` and `readable.cancel`)
     * when `AdbDaemonTransport.close` is called.
     *
     * @default false
     */
    preserveConnection?: boolean | undefined;
    /**
     * When set, the transport will throw an error when
     * one of the socket readable stalls for this amount of milliseconds.
     *
     * Because ADB is a multiplexed protocol, blocking one socket will also block all other sockets.
     * It's important to always read from all sockets to prevent stalling.
     *
     * This option is helpful to detect bugs in the client code.
     *
     * @default undefined
     */
    readTimeLimit?: number | undefined;
}
/**
 * An ADB Transport that connects to ADB Daemons directly.
 */
export declare class AdbDaemonTransport implements AdbTransport {
    #private;
    /**
     * Authenticate with the ADB Daemon and create a new transport.
     */
    static authenticate({ serial, connection, credentialStore, authenticators, features, initialDelayedAckBytes, ...options }: AdbDaemonAuthenticationOptions): Promise<AdbDaemonTransport>;
    get connection(): AdbDaemonConnection;
    get serial(): string;
    get protocolVersion(): number;
    get maxPayloadSize(): number;
    get banner(): AdbBanner;
    get disconnected(): Promise<void>;
    get clientFeatures(): readonly AdbFeature[];
    constructor({ serial, connection, version, banner, features, initialDelayedAckBytes, ...options }: AdbDaemonSocketConnectorConstructionOptions);
    connect(service: string): MaybePromiseLike<AdbSocket>;
    addReverseTunnel(handler: AdbIncomingSocketHandler, address?: string): string;
    removeReverseTunnel(address: string): void;
    clearReverseTunnels(): void;
    close(): MaybePromiseLike<void>;
}
export {};
//# sourceMappingURL=transport.d.ts.map