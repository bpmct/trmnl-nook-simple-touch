/**
 * Gets the `BigInt` value at the specified byte offset and length from the start of the view. There is
 * no alignment constraint; multi-byte values may be fetched from any offset.
 *
 * Only supports Big-Endian, because that's what ADB uses.
 * @param byteOffset The place in the buffer at which the value should be retrieved.
 */
export declare function getBigUint(array: Uint8Array, byteOffset: number, length: number): bigint;
/**
 * Stores an arbitrary-precision positive `BigInt` value at the specified byte offset from the start of the view.
 * @param byteOffset The place in the buffer at which the value should be set.
 * @param length The number of bytes to set.
 * @param value The value to set.
 * @param littleEndian If `false` or `undefined`, a big-endian value should be written,
 * otherwise a little-endian value should be written.
 */
export declare function setBigUint(array: Uint8Array, byteOffset: number, length: number, value: bigint, littleEndian?: boolean): void;
export declare function rsaParsePrivateKey(key: Uint8Array): [n: bigint, d: bigint];
export declare function modInverse(a: number, m: number): number;
export declare function adbGetPublicKeySize(): number;
export declare function adbGeneratePublicKey(privateKey: Uint8Array): Uint8Array<ArrayBuffer>;
export declare function adbGeneratePublicKey(privateKey: Uint8Array, output: Uint8Array): number;
/**
 * Modular exponentiation.
 *
 * Calculate `(base ** exponent) % modulus` without actually calculating `(base ** exponent)`.
 *
 * See https://en.wikipedia.org/wiki/Modular_exponentiation#Implementation_in_Lua
 */
export declare function powMod(base: bigint, exponent: bigint, modulus: bigint): bigint;
export declare const SHA1_DIGEST_LENGTH = 20;
export declare const ASN1_SEQUENCE = 48;
export declare const ASN1_OCTET_STRING = 4;
export declare const ASN1_NULL = 5;
export declare const ASN1_OID = 6;
export declare const SHA1_DIGEST_INFO: Uint8Array<ArrayBuffer>;
export declare function rsaSign(privateKey: Uint8Array, data: Uint8Array): Uint8Array<ArrayBuffer>;
//# sourceMappingURL=crypto.d.ts.map