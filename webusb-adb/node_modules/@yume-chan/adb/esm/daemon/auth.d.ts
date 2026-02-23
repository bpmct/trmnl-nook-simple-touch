import type { MaybePromiseLike } from "@yume-chan/async";
import type { Disposable } from "@yume-chan/event";
import type { AdbPacketData } from "./packet.js";
export interface AdbPrivateKey {
    /**
     * The private key in PKCS #8 format.
     */
    buffer: Uint8Array;
    name?: string | undefined;
}
export type AdbKeyIterable = Iterable<AdbPrivateKey> | AsyncIterable<AdbPrivateKey>;
export interface AdbCredentialStore {
    /**
     * Generates and stores a RSA private key with modulus length `2048` and public exponent `65537`.
     */
    generateKey(): MaybePromiseLike<AdbPrivateKey>;
    /**
     * Synchronously or asynchronously iterates through all stored RSA private keys.
     *
     * Each call to `iterateKeys` must return a different iterator that iterate through all stored keys.
     */
    iterateKeys(): AdbKeyIterable;
}
export declare const AdbAuthType: {
    readonly Token: 1;
    readonly Signature: 2;
    readonly PublicKey: 3;
};
export type AdbAuthType = (typeof AdbAuthType)[keyof typeof AdbAuthType];
export interface AdbAuthenticator {
    /**
     * @param getNextRequest
     *
     * Call this function to get the next authentication request packet from device.
     *
     * After calling `getNextRequest`, authenticator can `yield` a packet as response, or `return` to indicate its incapability of handling the request.
     *
     * After `return`, the `AdbAuthenticatorHandler` will move on to next authenticator and never go back.
     *
     * Calling `getNextRequest` multiple times without `yield` or `return` will always return the same request.
     */
    (credentialStore: AdbCredentialStore, getNextRequest: () => Promise<AdbPacketData>): AsyncIterable<AdbPacketData>;
}
export declare const AdbSignatureAuthenticator: AdbAuthenticator;
export declare const AdbPublicKeyAuthenticator: AdbAuthenticator;
export declare const ADB_DEFAULT_AUTHENTICATORS: readonly AdbAuthenticator[];
export declare class AdbAuthenticationProcessor implements Disposable {
    #private;
    readonly authenticators: readonly AdbAuthenticator[];
    constructor(authenticators: readonly AdbAuthenticator[], credentialStore: AdbCredentialStore);
    process(packet: AdbPacketData): Promise<AdbPacketData>;
    dispose(): void;
}
//# sourceMappingURL=auth.d.ts.map