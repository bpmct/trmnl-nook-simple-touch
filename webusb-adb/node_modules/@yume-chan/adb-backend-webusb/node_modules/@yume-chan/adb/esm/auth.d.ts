import type { Disposable } from "@yume-chan/event";
import type { ValueOrPromise } from "@yume-chan/struct";
import type { AdbPacketData } from "./packet.js";
export type AdbKeyIterable = Iterable<Uint8Array> | AsyncIterable<Uint8Array>;
export interface AdbCredentialStore {
    /**
     * Generate and store a RSA private key with modulus length `2048` and public exponent `65537`.
     *
     * The returned `Uint8Array` is the private key in PKCS #8 format.
     */
    generateKey(): ValueOrPromise<Uint8Array>;
    /**
     * Synchronously or asynchronously iterate through all stored RSA private keys.
     *
     * Each call to `iterateKeys` must return a different iterator that iterate through all stored keys.
     */
    iterateKeys(): AdbKeyIterable;
}
export declare enum AdbAuthType {
    Token = 1,
    Signature = 2,
    PublicKey = 3
}
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
export declare const ADB_DEFAULT_AUTHENTICATORS: AdbAuthenticator[];
export declare class AdbAuthenticationProcessor implements Disposable {
    readonly authenticators: readonly AdbAuthenticator[];
    private readonly credentialStore;
    private pendingRequest;
    private iterator;
    constructor(authenticators: readonly AdbAuthenticator[], credentialStore: AdbCredentialStore);
    private getNextRequest;
    private invokeAuthenticator;
    process(packet: AdbPacketData): Promise<AdbPacketData>;
    dispose(): void;
}
//# sourceMappingURL=auth.d.ts.map