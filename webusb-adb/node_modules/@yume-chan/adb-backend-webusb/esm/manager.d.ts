/// <reference types="w3c-web-usb" />
import type { AdbDeviceFilter } from "./backend.js";
import { AdbWebUsbBackend } from "./backend.js";
export declare class AdbWebUsbBackendManager {
    /**
     * Gets the instance of AdbWebUsbBackendManager using browser WebUSB implementation.
     *
     * May be `undefined` if the browser does not support WebUSB.
     */
    static readonly BROWSER: AdbWebUsbBackendManager | undefined;
    private _usb;
    /**
     * Create a new instance of `AdbWebUsbBackendManager` using the specified WebUSB API implementation.
     * @param usb A WebUSB compatible interface.
     */
    constructor(usb: USB);
    /**
     * Request access to a connected device.
     * This is a convince method for `usb.requestDevice()`.
     * @param filters
     * The filters to apply to the device list.
     *
     * It must have `classCode`, `subclassCode` and `protocolCode` fields for selecting the ADB interface,
     * but might also have `vendorId`, `productId` or `serialNumber` fields to limit the displayed device list.
     *
     * Defaults to {@link ADB_DEFAULT_DEVICE_FILTER}.
     * @param usbManager
     * A WebUSB compatible interface.
     * For example, `usb` NPM package for Node.js has a `webusb` object that can be used here.
     *
     * Defaults to `window.navigator.usb` (will throw an error if not exist).
     * @returns The `AdbWebUsbBackend` instance if the user selected a device,
     * or `undefined` if the user cancelled the device picker.
     */
    requestDevice(filters?: AdbDeviceFilter[]): Promise<AdbWebUsbBackend | undefined>;
    /**
     * Get all connected and authenticated devices.
     * This is a convince method for `usb.getDevices()`.
     * @param filters
     * The filters to apply to the device list.
     *
     * It must have `classCode`, `subclassCode` and `protocolCode` fields for selecting the ADB interface,
     * but might also have `vendorId`, `productId` or `serialNumber` fields to limit the displayed device list.
     *
     * Defaults to {@link ADB_DEFAULT_DEVICE_FILTER}.
     * @param usbManager
     * A WebUSB compatible interface.
     * For example, `usb` NPM package for Node.js has a `webusb` object that can be used here.
     *
     * Defaults to `window.navigator.usb` (will throw an error if not exist).
     * @returns An array of `AdbWebUsbBackend` instances for all connected and authenticated devices.
     */
    getDevices(filters?: AdbDeviceFilter[]): Promise<AdbWebUsbBackend[]>;
}
//# sourceMappingURL=manager.d.ts.map