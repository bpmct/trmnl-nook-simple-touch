import type { MaybePromiseLike } from "@yume-chan/async";
import type { AbortSignal, MaybeConsumable, ReadableStream, WritableStream } from "@yume-chan/stream-extra";
export interface AdbNoneProtocolProcess {
    get stdin(): WritableStream<MaybeConsumable<Uint8Array>>;
    /**
     * Mix of stdout and stderr
     */
    get output(): ReadableStream<Uint8Array>;
    get exited(): Promise<void>;
    kill(): MaybePromiseLike<void>;
}
export declare class AdbNoneProtocolSpawner {
    #private;
    constructor(spawn: (command: readonly string[], signal: AbortSignal | undefined) => Promise<AdbNoneProtocolProcess>);
    spawn(command: string | readonly string[], signal?: AbortSignal): Promise<AdbNoneProtocolProcess>;
    spawnWait(command: string | readonly string[]): Promise<Uint8Array>;
    spawnWaitText(command: string | readonly string[]): Promise<string>;
}
//# sourceMappingURL=spawner.d.ts.map