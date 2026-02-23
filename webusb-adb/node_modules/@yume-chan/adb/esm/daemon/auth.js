import { PromiseResolver } from "@yume-chan/async";
import { EmptyUint8Array } from "@yume-chan/struct";
import { calculateBase64EncodedLength, encodeBase64, encodeUtf8, } from "../utils/index.js";
import { adbGeneratePublicKey, adbGetPublicKeySize, rsaSign, } from "./crypto.js";
import { AdbCommand } from "./packet.js";
export const AdbAuthType = {
    Token: 1,
    Signature: 2,
    PublicKey: 3,
};
export const AdbSignatureAuthenticator = async function* (credentialStore, getNextRequest) {
    for await (const key of credentialStore.iterateKeys()) {
        const packet = await getNextRequest();
        if (packet.arg0 !== AdbAuthType.Token) {
            return;
        }
        const signature = rsaSign(key.buffer, packet.payload);
        yield {
            command: AdbCommand.Auth,
            arg0: AdbAuthType.Signature,
            arg1: 0,
            payload: signature,
        };
    }
};
export const AdbPublicKeyAuthenticator = async function* (credentialStore, getNextRequest) {
    const packet = await getNextRequest();
    if (packet.arg0 !== AdbAuthType.Token) {
        return;
    }
    let privateKey;
    for await (const key of credentialStore.iterateKeys()) {
        privateKey = key;
        break;
    }
    if (!privateKey) {
        privateKey = await credentialStore.generateKey();
    }
    const publicKeyLength = adbGetPublicKeySize();
    const [publicKeyBase64Length] = calculateBase64EncodedLength(publicKeyLength);
    const nameBuffer = privateKey.name?.length
        ? encodeUtf8(privateKey.name)
        : EmptyUint8Array;
    const publicKeyBuffer = new Uint8Array(publicKeyBase64Length +
        (nameBuffer.length ? nameBuffer.length + 1 : 0) + // Space character + name
        1);
    adbGeneratePublicKey(privateKey.buffer, publicKeyBuffer);
    encodeBase64(publicKeyBuffer.subarray(0, publicKeyLength), publicKeyBuffer);
    if (nameBuffer.length) {
        publicKeyBuffer[publicKeyBase64Length] = 0x20;
        publicKeyBuffer.set(nameBuffer, publicKeyBase64Length + 1);
    }
    yield {
        command: AdbCommand.Auth,
        arg0: AdbAuthType.PublicKey,
        arg1: 0,
        payload: publicKeyBuffer,
    };
};
export const ADB_DEFAULT_AUTHENTICATORS = [
    AdbSignatureAuthenticator,
    AdbPublicKeyAuthenticator,
];
export class AdbAuthenticationProcessor {
    authenticators;
    #credentialStore;
    #pendingRequest = new PromiseResolver();
    #iterator;
    constructor(authenticators, credentialStore) {
        this.authenticators = authenticators;
        this.#credentialStore = credentialStore;
    }
    #getNextRequest = () => {
        return this.#pendingRequest.promise;
    };
    async *#invokeAuthenticator() {
        for (const authenticator of this.authenticators) {
            for await (const packet of authenticator(this.#credentialStore, this.#getNextRequest)) {
                // If the authenticator yielded a response
                // Prepare `nextRequest` for next authentication request
                this.#pendingRequest = new PromiseResolver();
                // Yield the response to outer layer
                yield packet;
            }
            // If the authenticator returned,
            // Next authenticator will be given the same `pendingRequest`
        }
    }
    async process(packet) {
        if (!this.#iterator) {
            this.#iterator = this.#invokeAuthenticator();
        }
        this.#pendingRequest.resolve(packet);
        const result = await this.#iterator.next();
        if (result.done) {
            throw new Error("No authenticator can handle the request");
        }
        return result.value;
    }
    dispose() {
        void this.#iterator?.return?.();
    }
}
//# sourceMappingURL=auth.js.map