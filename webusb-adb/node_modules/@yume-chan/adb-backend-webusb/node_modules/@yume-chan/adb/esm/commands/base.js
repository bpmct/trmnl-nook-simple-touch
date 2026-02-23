import { AutoDisposable } from "@yume-chan/event";
export class AdbCommandBase extends AutoDisposable {
    adb;
    constructor(adb) {
        super();
        this.adb = adb;
    }
}
//# sourceMappingURL=base.js.map