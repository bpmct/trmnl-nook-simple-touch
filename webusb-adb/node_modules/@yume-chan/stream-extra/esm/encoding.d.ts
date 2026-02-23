import type { TransformStream } from "./stream.js";
export interface TextDecoderOptions {
    fatal?: boolean;
    ignoreBOM?: boolean;
}
declare class TextDecoderStreamType extends TransformStream<ArrayBufferView | ArrayBuffer, string> {
    constructor(label?: string, options?: TextDecoderOptions);
    readonly encoding: string;
    readonly fatal: boolean;
    readonly ignoreBOM: boolean;
}
declare class TextEncoderStreamType extends TransformStream<string, Uint8Array> {
    constructor();
    readonly encoding: string;
}
export declare const TextDecoderStream: typeof TextDecoderStreamType;
export type TextDecoderStream = TextDecoderStreamType;
export declare const TextEncoderStream: typeof TextEncoderStreamType;
export type TextEncoderStream = TextEncoderStreamType;
export {};
//# sourceMappingURL=encoding.d.ts.map