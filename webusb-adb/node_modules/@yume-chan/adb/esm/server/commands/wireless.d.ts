import type { AdbServerClient } from "../client.js";
export declare class NetworkError extends Error {
    constructor(message: string);
}
export declare class UnauthorizedError extends Error {
    constructor(message: string);
}
export declare class AlreadyConnectedError extends Error {
    constructor(message: string);
}
export declare class WirelessCommands {
    #private;
    constructor(client: AdbServerClient);
    /**
     * `adb pair <password> <address>`
     */
    pair(address: string, password: string): Promise<void>;
    /**
     * `adb connect <address>`
     */
    connect(address: string): Promise<void>;
    /**
     * `adb disconnect <address>`
     */
    disconnect(address: string): Promise<void>;
}
//# sourceMappingURL=wireless.d.ts.map