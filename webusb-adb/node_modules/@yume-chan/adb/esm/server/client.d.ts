import type { MaybePromiseLike } from "@yume-chan/async";
import type { Event } from "@yume-chan/event";
import type { AbortSignal, MaybeConsumable, ReadableWritablePair } from "@yume-chan/stream-extra";
import type { AdbIncomingSocketHandler, AdbSocket, Closeable } from "../adb.js";
import { Adb } from "../adb.js";
import type { DeviceObserver as DeviceObserverBase } from "../device-observer.js";
import type { AdbFeature } from "../features.js";
import { MDnsCommands, WirelessCommands, AlreadyConnectedError as _AlreadyConnectedError, NetworkError as _NetworkError, UnauthorizedError as _UnauthorizedError } from "./commands/index.js";
import { AdbServerDeviceObserverOwner } from "./observer.js";
import { AdbServerStream } from "./stream.js";
import { AdbServerTransport } from "./transport.js";
/**
 * Client for the ADB Server.
 */
export declare class AdbServerClient {
    #private;
    static NetworkError: typeof _NetworkError;
    static UnauthorizedError: typeof _UnauthorizedError;
    static AlreadyConnectedError: typeof _AlreadyConnectedError;
    static parseDeviceList(value: string, includeStates?: readonly AdbServerClient.ConnectionState[]): AdbServerClient.Device[];
    static formatDeviceService(device: AdbServerClient.DeviceSelector, command: string): string;
    readonly connector: AdbServerClient.ServerConnector;
    readonly wireless: WirelessCommands;
    readonly mDns: MDnsCommands;
    constructor(connector: AdbServerClient.ServerConnector);
    createConnection(request: string, options?: AdbServerClient.ServerConnectionOptions): Promise<AdbServerStream>;
    /**
     * `adb version`
     */
    getVersion(): Promise<number>;
    validateVersion(minimalVersion: number): Promise<void>;
    /**
     * `adb kill-server`
     */
    killServer(): Promise<void>;
    /**
     * `adb host-features`
     */
    getServerFeatures(): Promise<AdbFeature[]>;
    /**
     * Get a list of connected devices from ADB Server.
     *
     * Equivalent ADB Command: `adb devices -l`
     */
    getDevices(includeStates?: readonly AdbServerClient.ConnectionState[]): Promise<AdbServerClient.Device[]>;
    /**
     * Monitors device list changes.
     */
    trackDevices(options?: AdbServerDeviceObserverOwner.Options): Promise<AdbServerClient.DeviceObserver>;
    /**
     * `adb -s <device> reconnect` or `adb reconnect offline`
     */
    reconnectDevice(device: AdbServerClient.DeviceSelector | "offline"): Promise<void>;
    /**
     * Gets the features supported by the device.
     * The transport ID of the selected device is also returned,
     * so the caller can execute other commands against the same device.
     * @param device The device selector
     * @returns The transport ID of the selected device, and the features supported by the device.
     */
    getDeviceFeatures(device: AdbServerClient.DeviceSelector): Promise<{
        transportId: bigint;
        features: readonly AdbFeature[];
    }>;
    /**
     * Creates a connection that will forward the service to device.
     * @param device The device selector
     * @param service The service to forward
     * @returns An `AdbServerClient.Socket` that can be used to communicate with the service
     */
    createDeviceConnection(device: AdbServerClient.DeviceSelector, service: string): Promise<AdbServerClient.Socket>;
    /**
     * Wait for a device to be connected or disconnected.
     *
     * `adb wait-for-<state>`
     *
     * @param device The device selector
     * @param state The state to wait for
     * @param options The options
     * @returns A promise that resolves when the condition is met.
     */
    waitFor(device: AdbServerClient.DeviceSelector, state: "device" | "disconnect", options?: AdbServerClient.ServerConnectionOptions): Promise<void>;
    waitForDisconnect(transportId: bigint, options?: AdbServerClient.ServerConnectionOptions): Promise<void>;
    /**
     * Creates an ADB Transport for the specified device.
     */
    createTransport(device: AdbServerClient.DeviceSelector): Promise<AdbServerTransport>;
    createAdb(device: AdbServerClient.DeviceSelector): Promise<Adb>;
}
export declare function raceSignal<T>(callback: () => PromiseLike<T>, ...signals: (AbortSignal | undefined)[]): Promise<T>;
export declare namespace AdbServerClient {
    interface ServerConnectionOptions {
        unref?: boolean | undefined;
        signal?: AbortSignal | undefined;
    }
    interface ServerConnection extends ReadableWritablePair<Uint8Array, MaybeConsumable<Uint8Array>>, Closeable {
        get closed(): Promise<undefined>;
    }
    interface ServerConnector {
        connect(options?: ServerConnectionOptions): MaybePromiseLike<ServerConnection>;
        addReverseTunnel(handler: AdbIncomingSocketHandler, address?: string): MaybePromiseLike<string>;
        removeReverseTunnel(address: string): MaybePromiseLike<void>;
        clearReverseTunnels(): MaybePromiseLike<void>;
    }
    interface Socket extends AdbSocket {
        transportId: bigint;
    }
    /**
     * A union type for selecting a device.
     */
    type DeviceSelector = {
        transportId: bigint;
    } | {
        serial: string;
    } | {
        usb: true;
    } | {
        tcp: true;
    } | undefined;
    type ConnectionState = "unauthorized" | "offline" | "device";
    interface Device {
        serial: string;
        state: ConnectionState;
        /** @deprecated Use {@link state} instead */
        authenticating: boolean;
        product?: string | undefined;
        model?: string | undefined;
        device?: string | undefined;
        transportId: bigint;
    }
    interface DeviceObserver extends DeviceObserverBase<Device> {
        onError: Event<Error>;
    }
    type NetworkError = _NetworkError;
    type UnauthorizedError = _UnauthorizedError;
    type AlreadyConnectedError = _AlreadyConnectedError;
}
//# sourceMappingURL=client.d.ts.map