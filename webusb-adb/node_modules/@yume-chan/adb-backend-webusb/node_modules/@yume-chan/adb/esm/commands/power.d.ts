import { AdbCommandBase } from "./base.js";
export declare class AdbPower extends AdbCommandBase {
    reboot(name?: string): Promise<string>;
    bootloader(): Promise<string>;
    fastboot(): Promise<string>;
    recovery(): Promise<string>;
    sideload(): Promise<string>;
    /**
     * Reboot to Qualcomm Emergency Download (EDL) Mode.
     *
     * Only works on some Qualcomm devices.
     */
    qualcommEdlMode(): Promise<string>;
    powerOff(): Promise<string>;
    powerButton(longPress?: boolean): Promise<string>;
    /**
     * Reboot to Samsung Odin download mode.
     *
     * Only works on Samsung devices.
     */
    samsungOdin(): Promise<string>;
}
//# sourceMappingURL=power.d.ts.map