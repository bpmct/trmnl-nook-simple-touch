import type { Consumable, WritableStreamDefaultWriter } from "@yume-chan/stream-extra";
import { BufferedReadableStream } from "@yume-chan/stream-extra";
import type { StructAsyncDeserializeStream } from "@yume-chan/struct";
import type { AdbSocket } from "../../index.js";
import { AutoResetEvent } from "../../index.js";
export declare class AdbSyncSocketLocked implements StructAsyncDeserializeStream {
    private readonly _writer;
    private readonly _readable;
    private readonly _socketLock;
    private readonly _writeLock;
    private readonly _combiner;
    constructor(writer: WritableStreamDefaultWriter<Consumable<Uint8Array>>, readable: BufferedReadableStream, bufferSize: number, lock: AutoResetEvent);
    private writeInnerStream;
    flush(): Promise<void>;
    write(data: Uint8Array): Promise<void>;
    read(length: number): Promise<Uint8Array>;
    release(): void;
}
export declare class AdbSyncSocket {
    private _lock;
    private _socket;
    private _locked;
    constructor(socket: AdbSocket, bufferSize: number);
    lock(): Promise<AdbSyncSocketLocked>;
    close(): Promise<void>;
}
//# sourceMappingURL=socket.d.ts.map