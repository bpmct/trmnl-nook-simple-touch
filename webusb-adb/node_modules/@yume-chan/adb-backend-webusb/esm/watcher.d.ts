/// <reference types="w3c-web-usb" />
export declare class AdbWebUsbBackendWatcher {
    private _callback;
    private _usb;
    constructor(callback: (newDeviceSerial?: string) => void, usb: USB);
    dispose(): void;
    private handleConnect;
    private handleDisconnect;
}
//# sourceMappingURL=watcher.d.ts.map