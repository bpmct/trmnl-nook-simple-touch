/// <reference types="w3c-web-usb" />
import type { AdbBackend, AdbPacketData, AdbPacketInit } from "@yume-chan/adb";
import type { Consumable, ReadableWritablePair, WritableStream } from "@yume-chan/stream-extra";
import { ReadableStream } from "@yume-chan/stream-extra";
/**
 * `classCode`, `subclassCode` and `protocolCode` are required
 * for selecting correct USB configuration and interface.
 */
export type AdbDeviceFilter = USBDeviceFilter & Required<Pick<USBDeviceFilter, "classCode" | "subclassCode" | "protocolCode">>;
/**
 * The default filter for ADB devices, as defined by Google.
 */
export declare const ADB_DEFAULT_DEVICE_FILTER: {
    readonly classCode: 255;
    readonly subclassCode: 66;
    readonly protocolCode: 1;
};
export declare class AdbWebUsbBackendStream implements ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>> {
    private _readable;
    get readable(): ReadableStream<AdbPacketData>;
    private _writable;
    get writable(): WritableStream<Consumable<{
        command: number;
        arg0: number;
        arg1: number;
        checksum: number;
        magic: number;
        payload: Uint8Array;
    }>>;
    constructor(device: USBDevice, inEndpoint: USBEndpoint, outEndpoint: USBEndpoint, usbManager: USB);
}
export declare class AdbWebUsbBackend implements AdbBackend {
    private _filters;
    private _usb;
    private _device;
    get device(): USBDevice;
    get serial(): string;
    get name(): string;
    /**
     * Create a new instance of `AdbWebBackend` using a specified `USBDevice` instance
     *
     * @param device The `USBDevice` instance obtained elsewhere.
     * @param filters The filters to use when searching for ADB interface. Defaults to {@link ADB_DEFAULT_DEVICE_FILTER}.
     */
    constructor(device: USBDevice, filters: AdbDeviceFilter[] | undefined, usb: USB);
    /**
     * Claim the device and create a pair of `AdbPacket` streams to the ADB interface.
     * @returns The pair of `AdbPacket` streams.
     */
    connect(): Promise<ReadableWritablePair<AdbPacketData, Consumable<AdbPacketInit>>>;
}
//# sourceMappingURL=backend.d.ts.map