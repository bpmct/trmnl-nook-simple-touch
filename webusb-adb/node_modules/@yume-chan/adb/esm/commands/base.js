import { AutoDisposable } from "@yume-chan/event";
export class AdbServiceBase extends AutoDisposable {
    #adb;
    get adb() {
        return this.#adb;
    }
    constructor(adb) {
        super();
        this.#adb = adb;
    }
}
//# sourceMappingURL=base.js.map