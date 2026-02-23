interface TextEncoder {
    encode(input: string): Uint8Array;
}
interface TextDecoder {
    decode(buffer?: ArrayBufferView | ArrayBuffer, options?: {
        stream?: boolean;
    }): string;
}
export declare const TextEncoder: new () => TextEncoder, TextDecoder: new () => TextDecoder;
export declare function encodeUtf8(input: string): Uint8Array;
export declare function decodeUtf8(buffer: ArrayBufferView | ArrayBuffer): string;
export {};
//# sourceMappingURL=utils.d.ts.map