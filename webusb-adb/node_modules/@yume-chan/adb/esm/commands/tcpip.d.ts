import { AdbServiceBase } from "./base.js";
/**
 * ADB daemon checks for the following properties in the order of
 *
 * * `serviceListenAddresses` (`service.adb.listen_addrs`)
 * * `servicePort` (`service.adb.tcp.port`)
 * * `persistPort` (`persist.adb.tcp.port`)
 *
 * Once it finds a non-empty value, it will use it and ignore the rest.
 *
 * `serviceListenAddresses` and `persistPort` are fixed at build time,
 * only `servicePort` can be changed using `setPort` and `disable`.
 * This means if either `serviceListenAddresses` or `persistPort` is non-empty,
 * ADB over WiFi is always enabled.
 */
export interface AdbTcpIpListenAddresses {
    serviceListenAddresses: string[];
    servicePort: number | undefined;
    persistPort: number | undefined;
}
export declare class AdbTcpIpService extends AdbServiceBase {
    getListenAddresses(): Promise<AdbTcpIpListenAddresses>;
    setPort(port: number): Promise<string>;
    disable(): Promise<string>;
}
//# sourceMappingURL=tcpip.d.ts.map