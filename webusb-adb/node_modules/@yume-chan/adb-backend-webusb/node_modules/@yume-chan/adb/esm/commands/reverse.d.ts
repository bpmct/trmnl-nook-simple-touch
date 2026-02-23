import { AutoDisposable } from "@yume-chan/event";
import type { Adb } from "../adb.js";
import type { AdbIncomingSocketHandler, AdbSocket } from "../socket/index.js";
export interface AdbForwardListener {
    deviceSerial: string;
    localName: string;
    remoteName: string;
}
export declare class AdbReverseError extends Error {
    constructor(message: string);
}
export declare class AdbReverseNotSupportedError extends Error {
    constructor();
}
export declare class AdbReverseCommand extends AutoDisposable {
    protected localAddressToHandler: Map<string, AdbIncomingSocketHandler>;
    protected deviceAddressToLocalAddress: Map<string, string>;
    protected adb: Adb;
    protected listening: boolean;
    constructor(adb: Adb);
    protected handleIncomingSocket: (socket: AdbSocket) => Promise<boolean>;
    private createBufferedStream;
    private sendRequest;
    list(): Promise<AdbForwardListener[]>;
    /**
     * @param deviceAddress
     * The address to be listened on device by ADB daemon. Or `tcp:0` to choose an available TCP port.
     * @param localAddress
     * An identifier for the reverse tunnel.
     *
     * When a socket wants to connect to {@link deviceAddress}, native ADB client will forward that connection to {@link localAddress}.
     * However in this library, the {@link handler} is invoked instead. So this parameter is only used to identify the reverse tunnel.
     * @param handler A callback to handle incoming connections. It must return `true` if it accepts the connection.
     * @returns `tcp:{ACTUAL_LISTENING_PORT}`, If `deviceAddress` is `tcp:0`; otherwise, `deviceAddress`.
     * @throws {AdbReverseNotSupportedError} If ADB reverse tunnel is not supported on this device when connected wirelessly.
     * @throws {AdbReverseError} If ADB daemon returns an error.
     */
    add(deviceAddress: string, localAddress: string, handler: AdbIncomingSocketHandler): Promise<string>;
    remove(deviceAddress: string): Promise<void>;
    removeAll(): Promise<void>;
}
//# sourceMappingURL=reverse.d.ts.map