import type { MaybePromiseLike } from "@yume-chan/async";
import type { AdbServerClient } from "./client.js";
export declare const FAIL: Uint8Array<ArrayBufferLike>;
export declare class AdbServerStream {
    #private;
    constructor(connection: AdbServerClient.ServerConnection);
    readExactly(length: number): MaybePromiseLike<Uint8Array>;
    readString: (this: AdbServerStream) => MaybePromiseLike<string>;
    readOkay(): Promise<void>;
    writeString(value: string): Promise<void>;
    release(): {
        readable: import("@yume-chan/stream-extra").ReadableStream<Uint8Array<ArrayBufferLike>>;
        writable: import("@yume-chan/stream-extra/esm/types.js").WritableStream<import("@yume-chan/stream-extra").MaybeConsumable<Uint8Array<ArrayBufferLike>>>;
        closed: Promise<undefined>;
        close: () => MaybePromiseLike<void>;
    };
    dispose(): Promise<void>;
}
//# sourceMappingURL=stream.d.ts.map