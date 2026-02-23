import { AdbServerClient } from "./client.js";
export declare function unorderedRemove<T>(array: T[], index: number): void;
export declare class AdbServerDeviceObserverOwner {
    #private;
    current: readonly AdbServerClient.Device[];
    constructor(client: AdbServerClient);
    createObserver(options?: AdbServerDeviceObserverOwner.Options): Promise<AdbServerClient.DeviceObserver>;
}
export declare namespace AdbServerDeviceObserverOwner {
    interface Options extends AdbServerClient.ServerConnectionOptions {
        includeStates?: readonly AdbServerClient.ConnectionState[];
    }
}
//# sourceMappingURL=observer.d.ts.map