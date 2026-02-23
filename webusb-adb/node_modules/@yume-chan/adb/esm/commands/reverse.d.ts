import { BufferedReadableStream } from "@yume-chan/stream-extra";
import type { AdbIncomingSocketHandler } from "../adb.js";
import { AdbServiceBase } from "./base.js";
export interface AdbForwardListener {
    deviceSerial: string;
    localName: string;
    remoteName: string;
}
export declare class AdbReverseError extends Error {
    constructor(message: string);
}
export declare class AdbReverseNotSupportedError extends AdbReverseError {
    constructor();
}
export declare const AdbReverseErrorResponse: import("@yume-chan/struct").Struct<{
    length: import("@yume-chan/struct").Field<string, never, never, string> & {
        as: <T>(infer: T) => import("@yume-chan/struct").Field<T, never, never>;
    };
    content: import("@yume-chan/struct").Field<string, "length", Record<"length", string>, string> & {
        as: <T>(infer: T) => import("@yume-chan/struct").Field<T, "length", Record<"length", string>, T>;
    };
}, undefined, never>;
export declare class AdbReverseService extends AdbServiceBase {
    #private;
    protected createBufferedStream(service: string): Promise<BufferedReadableStream>;
    protected sendRequest(service: string): Promise<BufferedReadableStream>;
    /**
     * Get a list of all reverse port forwarding on the device.
     */
    list(): Promise<AdbForwardListener[]>;
    /**
     * Add a reverse port forwarding for a program that already listens on a port.
     */
    addExternal(deviceAddress: string, localAddress: string): Promise<string>;
    /**
     * Add a reverse port forwarding.
     */
    add(deviceAddress: string, handler: AdbIncomingSocketHandler, localAddress?: string): Promise<string>;
    /**
     * Remove a reverse port forwarding.
     */
    remove(deviceAddress: string): Promise<void>;
    /**
     * Remove all reverse port forwarding, including the ones added by other programs.
     */
    removeAll(): Promise<void>;
}
//# sourceMappingURL=reverse.d.ts.map