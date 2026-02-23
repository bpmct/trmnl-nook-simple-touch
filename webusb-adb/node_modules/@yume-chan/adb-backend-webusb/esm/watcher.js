export class AdbWebUsbBackendWatcher {
    _callback;
    _usb;
    constructor(callback, usb) {
        this._callback = callback;
        this._usb = usb;
        this._usb.addEventListener("connect", this.handleConnect);
        this._usb.addEventListener("disconnect", this.handleDisconnect);
    }
    dispose() {
        this._usb.removeEventListener("connect", this.handleConnect);
        this._usb.removeEventListener("disconnect", this.handleDisconnect);
    }
    handleConnect = (e) => {
        this._callback(e.device.serialNumber);
    };
    handleDisconnect = () => {
        this._callback();
    };
}
//# sourceMappingURL=watcher.js.map