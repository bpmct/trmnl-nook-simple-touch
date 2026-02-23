import type { AdbIncomingSocketHandler, AdbSocket, AdbTransport } from "../adb.js";
import type { AdbBanner } from "../banner.js";
import { AdbFeature } from "../features.js";
import type { AdbServerClient } from "./client.js";
export declare const ADB_SERVER_DEFAULT_FEATURES: readonly AdbFeature[];
export declare class AdbServerTransport implements AdbTransport {
    #private;
    readonly serial: string;
    readonly transportId: bigint;
    readonly maxPayloadSize: number;
    readonly banner: AdbBanner;
    get disconnected(): Promise<void>;
    get clientFeatures(): readonly AdbFeature[];
    constructor(client: AdbServerClient, serial: string, banner: AdbBanner, transportId: bigint, disconnected: Promise<void>);
    connect(service: string): Promise<AdbSocket>;
    addReverseTunnel(handler: AdbIncomingSocketHandler, address?: string): Promise<string>;
    removeReverseTunnel(address: string): Promise<void>;
    clearReverseTunnels(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=transport.d.ts.map