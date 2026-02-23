/**
 * Calculate the required length of the output buffer for the given input length.
 *
 * @param inputLength Length of the input in bytes
 * @returns Length of the output in bytes
 */
export declare function calculateBase64EncodedLength(inputLength: number): [outputLength: number, paddingLength: number];
/**
 * Encode the given input buffer into base64.
 *
 * @param input The input buffer
 * @returns The encoded output buffer
 */
export declare function encodeBase64(input: Uint8Array): Uint8Array<ArrayBuffer>;
/**
 * Encode the given input into base64 and write it to the output buffer.
 *
 * The output buffer must be at least as long as the value returned by `calculateBase64EncodedLength`.
 * It can points to the same buffer as the input, as long as `output.offset <= input.offset - input.length / 3`,
 * or `output.offset >= input.offset - 1`
 *
 * @param input The input buffer
 * @param output The output buffer
 * @returns The number of bytes written to the output buffer
 */
export declare function encodeBase64(input: Uint8Array, output: Uint8Array): number;
export declare function decodeBase64(input: string): Uint8Array<ArrayBuffer>;
//# sourceMappingURL=base64.d.ts.map