import type { MaybePromiseLike } from "@yume-chan/async";
import type { AbortSignal, MaybeConsumable, ReadableStream, WritableStream } from "@yume-chan/stream-extra";
export interface AdbShellProtocolProcess {
    get stdin(): WritableStream<MaybeConsumable<Uint8Array>>;
    get stdout(): ReadableStream<Uint8Array>;
    get stderr(): ReadableStream<Uint8Array>;
    get exited(): Promise<number>;
    kill(): MaybePromiseLike<void>;
}
export declare class AdbShellProtocolSpawner {
    #private;
    constructor(spawn: (command: readonly string[], signal: AbortSignal | undefined) => Promise<AdbShellProtocolProcess>);
    spawn(command: string | readonly string[], signal?: AbortSignal): Promise<AdbShellProtocolProcess>;
    spawnWait(command: string | readonly string[]): Promise<AdbShellProtocolSpawner.WaitResult<Uint8Array>>;
    spawnWaitText(command: string | readonly string[]): Promise<AdbShellProtocolSpawner.WaitResult<string>>;
}
export declare namespace AdbShellProtocolSpawner {
    interface WaitResult<T> {
        stdout: T;
        stderr: T;
        exitCode: number;
    }
}
//# sourceMappingURL=spawner.d.ts.map