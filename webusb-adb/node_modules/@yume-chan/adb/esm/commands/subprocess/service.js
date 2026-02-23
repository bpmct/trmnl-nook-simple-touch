import { AdbFeature } from "../../features.js";
import { AdbNoneProtocolSubprocessService } from "./none/index.js";
import { AdbShellProtocolSubprocessService } from "./shell/index.js";
export class AdbSubprocessService {
    #adb;
    get adb() {
        return this.#adb;
    }
    #noneProtocol;
    get noneProtocol() {
        return this.#noneProtocol;
    }
    #shellProtocol;
    get shellProtocol() {
        return this.#shellProtocol;
    }
    constructor(adb) {
        this.#adb = adb;
        this.#noneProtocol = new AdbNoneProtocolSubprocessService(adb);
        if (adb.canUseFeature(AdbFeature.ShellV2)) {
            this.#shellProtocol = new AdbShellProtocolSubprocessService(adb);
        }
    }
}
//# sourceMappingURL=service.js.map