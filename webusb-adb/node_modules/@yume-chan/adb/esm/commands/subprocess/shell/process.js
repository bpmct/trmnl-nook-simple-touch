import { PromiseResolver } from "@yume-chan/async";
import { MaybeConsumable, PushReadableStream, StructDeserializeStream, WritableStream, } from "@yume-chan/stream-extra";
import { EmptyUint8Array } from "@yume-chan/struct";
import { AdbShellProtocolId, AdbShellProtocolPacket } from "./shared.js";
export class AdbShellProtocolProcessImpl {
    #socket;
    #writer;
    #stdin;
    get stdin() {
        return this.#stdin;
    }
    #stdout;
    get stdout() {
        return this.#stdout;
    }
    #stderr;
    get stderr() {
        return this.#stderr;
    }
    #exited;
    get exited() {
        return this.#exited;
    }
    constructor(socket, signal) {
        this.#socket = socket;
        let stdoutController;
        let stderrController;
        this.#stdout = new PushReadableStream((controller) => {
            stdoutController = controller;
        });
        this.#stderr = new PushReadableStream((controller) => {
            stderrController = controller;
        });
        const exited = new PromiseResolver();
        this.#exited = exited.promise;
        socket.readable
            .pipeThrough(new StructDeserializeStream(AdbShellProtocolPacket))
            .pipeTo(new WritableStream({
            write: async (chunk) => {
                switch (chunk.id) {
                    case AdbShellProtocolId.Exit:
                        exited.resolve(chunk.data[0]);
                        break;
                    case AdbShellProtocolId.Stdout:
                        await stdoutController.enqueue(chunk.data);
                        break;
                    case AdbShellProtocolId.Stderr:
                        await stderrController.enqueue(chunk.data);
                        break;
                    default:
                        // Ignore unknown messages like Google ADB does
                        // https://cs.android.com/android/platform/superproject/main/+/main:packages/modules/adb/daemon/shell_service.cpp;l=684;drc=61197364367c9e404c7da6900658f1b16c42d0da
                        break;
                }
            },
        }))
            .then(() => {
            stdoutController.close();
            stderrController.close();
            // If `exited` has already settled, this will be a no-op
            exited.reject(new Error("Socket ended without exit message"));
        }, (e) => {
            stdoutController.error(e);
            stderrController.error(e);
            // If `exited` has already settled, this will be a no-op
            exited.reject(e);
        });
        if (signal) {
            // `signal` won't affect `this.stdout` and `this.stderr`
            // So remaining data can still be read
            // (call `controller.error` will discard all pending data)
            signal.addEventListener("abort", () => {
                exited.reject(signal.reason);
                this.#socket.close();
            });
        }
        this.#writer = this.#socket.writable.getWriter();
        this.#stdin = new MaybeConsumable.WritableStream({
            write: async (chunk) => {
                await this.#writer.write(AdbShellProtocolPacket.serialize({
                    id: AdbShellProtocolId.Stdin,
                    data: chunk,
                }));
            },
            close: () => 
            // Only shell protocol + raw mode supports closing stdin
            this.#writer.write(AdbShellProtocolPacket.serialize({
                id: AdbShellProtocolId.CloseStdin,
                data: EmptyUint8Array,
            })),
        });
    }
    kill() {
        return this.#socket.close();
    }
}
//# sourceMappingURL=process.js.map