import type { Adb } from "../../../adb.js";
import { AdbNoneProtocolPtyProcess } from "./pty.js";
import { AdbNoneProtocolSpawner } from "./spawner.js";
export declare class AdbNoneProtocolSubprocessService extends AdbNoneProtocolSpawner {
    #private;
    get adb(): Adb;
    constructor(adb: Adb);
    pty(command?: string | readonly string[]): Promise<AdbNoneProtocolPtyProcess>;
}
//# sourceMappingURL=service.d.ts.map