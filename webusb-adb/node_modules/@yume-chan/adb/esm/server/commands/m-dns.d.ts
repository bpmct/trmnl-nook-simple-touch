import type { AdbServerClient } from "../client.js";
export declare class MDnsCommands {
    #private;
    constructor(client: AdbServerClient);
    check(): Promise<boolean>;
    getServices(): Promise<{
        name: string;
        service: string;
        address: string;
    }[]>;
}
//# sourceMappingURL=m-dns.d.ts.map