import { AutoDisposable } from "@yume-chan/event";
import type { Adb } from "../adb.js";
export declare class AdbServiceBase extends AutoDisposable {
    #private;
    get adb(): Adb;
    constructor(adb: Adb);
}
//# sourceMappingURL=base.d.ts.map