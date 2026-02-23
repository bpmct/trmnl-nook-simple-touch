import type { MaybePromiseLike } from "@yume-chan/async";
import type { MaybeConsumable, ReadableWritablePair } from "@yume-chan/stream-extra";
import type { AdbBanner } from "./banner.js";
import type { AdbFrameBuffer } from "./commands/index.js";
import { AdbPower, AdbReverseService, AdbSubprocessService, AdbSync, AdbTcpIpService } from "./commands/index.js";
import type { AdbFeature } from "./features.js";
export interface Closeable {
    close(): MaybePromiseLike<void>;
}
/**
 * Represents an ADB socket.
 */
export interface AdbSocket extends ReadableWritablePair<Uint8Array, MaybeConsumable<Uint8Array>>, Closeable {
    get service(): string;
    get closed(): Promise<undefined>;
}
export type AdbIncomingSocketHandler = (socket: AdbSocket) => MaybePromiseLike<void>;
export interface AdbTransport extends Closeable {
    readonly serial: string;
    readonly maxPayloadSize: number;
    readonly banner: AdbBanner;
    readonly disconnected: Promise<void>;
    readonly clientFeatures: readonly AdbFeature[];
    connect(service: string): MaybePromiseLike<AdbSocket>;
    addReverseTunnel(handler: AdbIncomingSocketHandler, address?: string): MaybePromiseLike<string>;
    removeReverseTunnel(address: string): MaybePromiseLike<void>;
    clearReverseTunnels(): MaybePromiseLike<void>;
}
export declare class Adb implements Closeable {
    #private;
    get transport(): AdbTransport;
    get serial(): string;
    get maxPayloadSize(): number;
    get banner(): AdbBanner;
    get disconnected(): Promise<void>;
    get clientFeatures(): readonly AdbFeature[];
    get deviceFeatures(): readonly AdbFeature[];
    readonly subprocess: AdbSubprocessService;
    readonly power: AdbPower;
    readonly reverse: AdbReverseService;
    readonly tcpip: AdbTcpIpService;
    constructor(transport: AdbTransport);
    canUseFeature(feature: AdbFeature): boolean;
    /**
     * Creates a new ADB Socket to the specified service or socket address.
     */
    createSocket(service: string): Promise<AdbSocket>;
    createSocketAndWait(service: string): Promise<string>;
    getProp(key: string): Promise<string>;
    rm(filenames: string | readonly string[], options?: {
        recursive?: boolean;
        force?: boolean;
    }): Promise<string>;
    sync(): Promise<AdbSync>;
    framebuffer(): Promise<AdbFrameBuffer>;
    close(): Promise<void>;
}
//# sourceMappingURL=adb.d.ts.map