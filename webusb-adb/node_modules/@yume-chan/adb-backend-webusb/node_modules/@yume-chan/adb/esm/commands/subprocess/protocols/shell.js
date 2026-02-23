import { PromiseResolver } from "@yume-chan/async";
import { ConsumableTransformStream, ConsumableWritableStream, PushReadableStream, StructDeserializeStream, TransformStream, WritableStream, pipeFrom, } from "@yume-chan/stream-extra";
import Struct, { placeholder } from "@yume-chan/struct";
import { AdbFeature } from "../../../features.js";
import { encodeUtf8 } from "../../../utils/index.js";
export var AdbShellProtocolId;
(function (AdbShellProtocolId) {
    AdbShellProtocolId[AdbShellProtocolId["Stdin"] = 0] = "Stdin";
    AdbShellProtocolId[AdbShellProtocolId["Stdout"] = 1] = "Stdout";
    AdbShellProtocolId[AdbShellProtocolId["Stderr"] = 2] = "Stderr";
    AdbShellProtocolId[AdbShellProtocolId["Exit"] = 3] = "Exit";
    AdbShellProtocolId[AdbShellProtocolId["CloseStdin"] = 4] = "CloseStdin";
    AdbShellProtocolId[AdbShellProtocolId["WindowSizeChange"] = 5] = "WindowSizeChange";
})(AdbShellProtocolId = AdbShellProtocolId || (AdbShellProtocolId = {}));
// This packet format is used in both direction.
const AdbShellProtocolPacket = new Struct({ littleEndian: true })
    .uint8("id", placeholder())
    .uint32("length")
    .uint8Array("data", { lengthField: "length" });
class StdinSerializeStream extends ConsumableTransformStream {
    constructor() {
        super({
            async transform(chunk, controller) {
                await controller.enqueue({
                    id: AdbShellProtocolId.Stdin,
                    data: chunk,
                });
            },
            flush() {
                // TODO: AdbShellSubprocessProtocol: support closing stdin
            },
        });
    }
}
class StdoutDeserializeStream extends TransformStream {
    constructor(type) {
        super({
            transform(chunk, controller) {
                if (chunk.id === type) {
                    controller.enqueue(chunk.data);
                }
            },
        });
    }
}
class MultiplexStream {
    _readable;
    _readableController;
    get readable() {
        return this._readable;
    }
    _activeCount = 0;
    constructor() {
        this._readable = new PushReadableStream((controller) => {
            this._readableController = controller;
        });
    }
    createWriteable() {
        return new WritableStream({
            start: () => {
                this._activeCount += 1;
            },
            write: async (chunk) => {
                await this._readableController.enqueue(chunk);
            },
            abort: () => {
                this._activeCount -= 1;
                if (this._activeCount === 0) {
                    this._readableController.close();
                }
            },
            close: () => {
                this._activeCount -= 1;
                if (this._activeCount === 0) {
                    this._readableController.close();
                }
            },
        });
    }
}
/**
 * Shell v2 a.k.a Shell Protocol
 *
 * Features:
 * * `stderr`: Yes
 * * `exit` exit code: Yes
 * * `resize`: Yes
 */
export class AdbSubprocessShellProtocol {
    static isSupported(adb) {
        return adb.supportsFeature(AdbFeature.ShellV2);
    }
    static async pty(adb, command) {
        // TODO: AdbShellSubprocessProtocol: Support setting `XTERM` environment variable
        return new AdbSubprocessShellProtocol(await adb.createSocket(`shell,v2,pty:${command}`));
    }
    static async raw(adb, command) {
        return new AdbSubprocessShellProtocol(await adb.createSocket(`shell,v2,raw:${command}`));
    }
    _socket;
    _socketWriter;
    _stdin;
    get stdin() {
        return this._stdin;
    }
    _stdout;
    get stdout() {
        return this._stdout;
    }
    _stderr;
    get stderr() {
        return this._stderr;
    }
    _exit = new PromiseResolver();
    get exit() {
        return this._exit.promise;
    }
    constructor(socket) {
        this._socket = socket;
        // Check this image to help you understand the stream graph
        // cspell: disable-next-line
        // https://www.plantuml.com/plantuml/png/bL91QiCm4Bpx5SAdv90lb1JISmiw5XzaQKf5PIkiLZIqzEyLSg8ks13gYtOykpFhiOw93N6UGjVDqK7rZsxKqNw0U_NTgVAy4empOy2mm4_olC0VEVEE47GUpnGjKdgXoD76q4GIEpyFhOwP_m28hW0NNzxNUig1_JdW0bA7muFIJDco1daJ_1SAX9bgvoPJPyIkSekhNYctvIGXrCH6tIsPL5fs-s6J5yc9BpWXhKtNdF2LgVYPGM_6GlMwfhWUsIt4lbScANrwlgVVUifPSVi__t44qStnwPvZwobdSmHHlL57p2vFuHS0
        // TODO: AdbShellSubprocessProtocol: Optimize stream graph
        const [stdout, stderr] = socket.readable
            .pipeThrough(new StructDeserializeStream(AdbShellProtocolPacket))
            .pipeThrough(new TransformStream({
            transform: (chunk, controller) => {
                if (chunk.id === AdbShellProtocolId.Exit) {
                    this._exit.resolve(new Uint8Array(chunk.data)[0]);
                    // We can let `StdoutDeserializeStream` to process `AdbShellProtocolId.Exit`,
                    // but since we need this `TransformStream` to capture the exit code anyway,
                    // terminating child streams here is killing two birds with one stone.
                    controller.terminate();
                    return;
                }
                controller.enqueue(chunk);
            },
        }))
            .tee();
        this._stdout = stdout.pipeThrough(new StdoutDeserializeStream(AdbShellProtocolId.Stdout));
        this._stderr = stderr.pipeThrough(new StdoutDeserializeStream(AdbShellProtocolId.Stderr));
        const multiplexer = new MultiplexStream();
        void multiplexer.readable
            .pipeThrough(new ConsumableTransformStream({
            async transform(chunk, controller) {
                await controller.enqueue(AdbShellProtocolPacket.serialize(chunk));
            },
        }))
            .pipeTo(socket.writable);
        this._stdin = pipeFrom(multiplexer.createWriteable(), new StdinSerializeStream());
        this._socketWriter = multiplexer.createWriteable().getWriter();
    }
    async resize(rows, cols) {
        await ConsumableWritableStream.write(this._socketWriter, {
            id: AdbShellProtocolId.WindowSizeChange,
            data: encodeUtf8(
            // The "correct" format is `${rows}x${cols},${x_pixels}x${y_pixels}`
            // However, according to https://linux.die.net/man/4/tty_ioctl
            // `x_pixels` and `y_pixels` are unused, so always sending `0` should be fine.
            `${rows}x${cols},0x0\0`),
        });
    }
    kill() {
        return this._socket.close();
    }
}
//# sourceMappingURL=shell.js.map