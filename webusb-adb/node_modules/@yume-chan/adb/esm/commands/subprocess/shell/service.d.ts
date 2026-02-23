import type { Adb } from "../../../adb.js";
import { AdbShellProtocolPtyProcess } from "./pty.js";
import { AdbShellProtocolSpawner } from "./spawner.js";
export declare class AdbShellProtocolSubprocessService extends AdbShellProtocolSpawner {
    #private;
    get adb(): Adb;
    get isSupported(): boolean;
    constructor(adb: Adb);
    pty(options?: {
        command?: string | readonly string[] | undefined;
        terminalType?: string;
    }): Promise<AdbShellProtocolPtyProcess>;
}
//# sourceMappingURL=service.d.ts.map