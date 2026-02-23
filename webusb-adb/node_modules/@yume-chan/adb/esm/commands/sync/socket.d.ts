import type { MaybeConsumable, WritableStreamDefaultWriter } from "@yume-chan/stream-extra";
import { BufferedReadableStream } from "@yume-chan/stream-extra";
import type { AsyncExactReadable } from "@yume-chan/struct";
import type { AdbSocket } from "../../adb.js";
import { AutoResetEvent } from "../../utils/index.js";
export declare class AdbSyncSocketLocked implements AsyncExactReadable {
    #private;
    get position(): number;
    constructor(writer: WritableStreamDefaultWriter<MaybeConsumable<Uint8Array>>, readable: BufferedReadableStream, bufferSize: number, lock: AutoResetEvent);
    flush(): Promise<void>;
    write(data: Uint8Array): Promise<void>;
    readExactly(length: number): Promise<Uint8Array<ArrayBufferLike>>;
    release(): void;
    close(): Promise<void>;
}
export declare class AdbSyncSocket {
    #private;
    constructor(socket: AdbSocket, bufferSize: number);
    lock(): Promise<AdbSyncSocketLocked>;
    close(): Promise<void>;
}
//# sourceMappingURL=socket.d.ts.map