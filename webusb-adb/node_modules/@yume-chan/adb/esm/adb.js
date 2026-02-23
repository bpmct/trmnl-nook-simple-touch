import { ConcatStringStream, TextDecoderStream } from "@yume-chan/stream-extra";
import { AdbPower, AdbReverseService, AdbSubprocessService, AdbSync, AdbTcpIpService, escapeArg, framebuffer, } from "./commands/index.js";
export class Adb {
    #transport;
    get transport() {
        return this.#transport;
    }
    get serial() {
        return this.#transport.serial;
    }
    get maxPayloadSize() {
        return this.#transport.maxPayloadSize;
    }
    get banner() {
        return this.#transport.banner;
    }
    get disconnected() {
        return this.#transport.disconnected;
    }
    get clientFeatures() {
        return this.#transport.clientFeatures;
    }
    get deviceFeatures() {
        return this.banner.features;
    }
    subprocess;
    power;
    reverse;
    tcpip;
    constructor(transport) {
        this.#transport = transport;
        this.subprocess = new AdbSubprocessService(this);
        this.power = new AdbPower(this);
        this.reverse = new AdbReverseService(this);
        this.tcpip = new AdbTcpIpService(this);
    }
    canUseFeature(feature) {
        return (this.clientFeatures.includes(feature) &&
            this.deviceFeatures.includes(feature));
    }
    /**
     * Creates a new ADB Socket to the specified service or socket address.
     */
    async createSocket(service) {
        return this.#transport.connect(service);
    }
    async createSocketAndWait(service) {
        const socket = await this.createSocket(service);
        return await socket.readable
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(new ConcatStringStream());
    }
    getProp(key) {
        return this.subprocess.noneProtocol
            .spawnWaitText(["getprop", key])
            .then((output) => output.trim());
    }
    rm(filenames, options) {
        const args = ["rm"];
        if (options?.recursive) {
            args.push("-r");
        }
        if (options?.force) {
            args.push("-f");
        }
        if (Array.isArray(filenames)) {
            for (const filename of filenames) {
                // https://github.com/microsoft/typescript/issues/17002
                args.push(escapeArg(filename));
            }
        }
        else {
            // https://github.com/microsoft/typescript/issues/17002
            args.push(escapeArg(filenames));
        }
        // https://android.googlesource.com/platform/packages/modules/adb/+/1a0fb8846d4e6b671c8aa7f137a8c21d7b248716/client/adb_install.cpp#984
        args.push("</dev/null");
        return this.subprocess.noneProtocol.spawnWaitText(args);
    }
    async sync() {
        const socket = await this.createSocket("sync:");
        return new AdbSync(this, socket);
    }
    async framebuffer() {
        return framebuffer(this);
    }
    async close() {
        await this.#transport.close();
    }
}
//# sourceMappingURL=adb.js.map