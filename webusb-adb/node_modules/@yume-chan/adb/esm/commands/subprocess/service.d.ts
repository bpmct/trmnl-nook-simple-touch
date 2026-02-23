import type { Adb } from "../../adb.js";
import { AdbNoneProtocolSubprocessService } from "./none/index.js";
import { AdbShellProtocolSubprocessService } from "./shell/index.js";
export declare class AdbSubprocessService {
    #private;
    get adb(): Adb;
    get noneProtocol(): AdbNoneProtocolSubprocessService;
    get shellProtocol(): AdbShellProtocolSubprocessService | undefined;
    constructor(adb: Adb);
}
//# sourceMappingURL=service.d.ts.map