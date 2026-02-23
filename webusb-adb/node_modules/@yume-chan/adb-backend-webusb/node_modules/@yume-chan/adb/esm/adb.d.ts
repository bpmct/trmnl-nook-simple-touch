import type { Consumable, ReadableWritablePair } from "@yume-chan/stream-extra";
import type { AdbCredentialStore } from "./auth.js";
import type { AdbFrameBuffer } from "./commands/index.js";
import { AdbPower, AdbReverseCommand, AdbSubprocess, AdbSync, AdbTcpIpCommand } from "./commands/index.js";
import { AdbFeature } from "./features.js";
import type { AdbPacketData, AdbPacketInit } from "./packet.js";
import type { AdbIncomingSocketHandler, AdbSocket, Closeable } from "./socket/index.js";
export declare enum AdbPropKey {
    Product = "ro.product.name",
    Model = "ro.product.model",
    Device = "ro.product.device",
    Features = "features"
}
export declare const VERSION_OMIT_CHECKSUM = 16777217;
export declare class Adb implements Closeable {
    /**
     * It's possible to call `authenticate` multiple times on a single connection,
     * every time the device receives a `CNXN` packet, it resets its internal state,
     * and starts a new authentication process.
     */
    static authenticate(connection: ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>>, credentialStore: AdbCredentialStore, authenticators?: import("./auth.js").AdbAuthenticator[]): Promise<Adb>;
    private readonly dispatcher;
    get disconnected(): Promise<void>;
    private _protocolVersion;
    get protocolVersion(): number;
    private _maxPayloadSize;
    get maxPayloadSize(): number;
    private _product;
    get product(): string | undefined;
    private _model;
    get model(): string | undefined;
    private _device;
    get device(): string | undefined;
    private _features;
    get features(): AdbFeature[];
    readonly subprocess: AdbSubprocess;
    readonly power: AdbPower;
    readonly reverse: AdbReverseCommand;
    readonly tcpip: AdbTcpIpCommand;
    constructor(connection: ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>>, version: number, maxPayloadSize: number, banner: string);
    private parseBanner;
    supportsFeature(feature: AdbFeature): boolean;
    /**
     * Add a handler for incoming socket.
     * @param handler A function to call with new incoming sockets. It must return `true` if it accepts the socket.
     * @returns A function to remove the handler.
     */
    onIncomingSocket(handler: AdbIncomingSocketHandler): import("@yume-chan/event").RemoveEventListener;
    createSocket(service: string): Promise<AdbSocket>;
    createSocketAndWait(service: string): Promise<string>;
    getProp(key: string): Promise<string>;
    rm(...filenames: string[]): Promise<string>;
    sync(): Promise<AdbSync>;
    framebuffer(): Promise<AdbFrameBuffer>;
    /**
     * Close the ADB connection.
     *
     * Note that it won't close the streams from backends.
     * The streams are both physically and logically intact,
     * and can be reused.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=adb.d.ts.map