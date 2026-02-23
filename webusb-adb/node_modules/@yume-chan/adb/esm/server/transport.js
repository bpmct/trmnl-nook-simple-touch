import { PromiseResolver } from "@yume-chan/async";
import { AdbFeature } from "../features.js";
export const ADB_SERVER_DEFAULT_FEATURES = /* #__PURE__ */ (() => [
    AdbFeature.ShellV2,
    AdbFeature.Cmd,
    AdbFeature.StatV2,
    AdbFeature.ListV2,
    AdbFeature.FixedPushMkdir,
    "apex",
    AdbFeature.Abb,
    // only tells the client the symlink timestamp issue in `adb push --sync` has been fixed.
    // No special handling required.
    "fixed_push_symlink_timestamp",
    AdbFeature.AbbExec,
    "remount_shell",
    "track_app",
    AdbFeature.SendReceiveV2,
    "sendrecv_v2_brotli",
    "sendrecv_v2_lz4",
    "sendrecv_v2_zstd",
    "sendrecv_v2_dry_run_send",
])();
export class AdbServerTransport {
    #client;
    serial;
    transportId;
    maxPayloadSize = 1 * 1024 * 1024;
    banner;
    #sockets = [];
    #closed = new PromiseResolver();
    #disconnected;
    get disconnected() {
        return this.#disconnected;
    }
    get clientFeatures() {
        // No need to get host features (features supported by ADB server)
        // Because we create all ADB packets ourselves
        return ADB_SERVER_DEFAULT_FEATURES;
    }
    // eslint-disable-next-line @typescript-eslint/max-params
    constructor(client, serial, banner, transportId, disconnected) {
        this.#client = client;
        this.serial = serial;
        this.banner = banner;
        this.transportId = transportId;
        this.#disconnected = Promise.race([this.#closed.promise, disconnected]);
    }
    async connect(service) {
        const socket = await this.#client.createDeviceConnection({ transportId: this.transportId }, service);
        this.#sockets.push(socket);
        return socket;
    }
    async addReverseTunnel(handler, address) {
        return await this.#client.connector.addReverseTunnel(handler, address);
    }
    async removeReverseTunnel(address) {
        await this.#client.connector.removeReverseTunnel(address);
    }
    async clearReverseTunnels() {
        await this.#client.connector.clearReverseTunnels();
    }
    async close() {
        for (const socket of this.#sockets) {
            await socket.close();
        }
        this.#sockets.length = 0;
        this.#closed.resolve();
    }
}
//# sourceMappingURL=transport.js.map