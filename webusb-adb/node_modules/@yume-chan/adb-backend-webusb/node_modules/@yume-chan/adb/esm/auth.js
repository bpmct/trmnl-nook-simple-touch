import { PromiseResolver } from "@yume-chan/async";
import { calculatePublicKey, calculatePublicKeyLength, sign, } from "./crypto.js";
import { AdbCommand } from "./packet.js";
import { calculateBase64EncodedLength, encodeBase64 } from "./utils/index.js";
export var AdbAuthType;
(function (AdbAuthType) {
    AdbAuthType[AdbAuthType["Token"] = 1] = "Token";
    AdbAuthType[AdbAuthType["Signature"] = 2] = "Signature";
    AdbAuthType[AdbAuthType["PublicKey"] = 3] = "PublicKey";
})(AdbAuthType = AdbAuthType || (AdbAuthType = {}));
export const AdbSignatureAuthenticator = async function* (credentialStore, getNextRequest) {
    for await (const key of credentialStore.iterateKeys()) {
        const packet = await getNextRequest();
        if (packet.arg0 !== AdbAuthType.Token) {
            return;
        }
        const signature = sign(key, packet.payload);
        yield {
            command: AdbCommand.Auth,
            arg0: AdbAuthType.Signature,
            arg1: 0,
            payload: new Uint8Array(signature),
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
    const publicKeyLength = calculatePublicKeyLength();
    const [publicKeyBase64Length] = calculateBase64EncodedLength(publicKeyLength);
    const publicKeyBuffer = new Uint8Array(publicKeyBase64Length + 1 // Null character
    );
    calculatePublicKey(privateKey, publicKeyBuffer);
    encodeBase64(publicKeyBuffer.subarray(0, publicKeyLength), publicKeyBuffer);
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
    credentialStore;
    pendingRequest = new PromiseResolver();
    iterator;
    constructor(authenticators, credentialStore) {
        this.authenticators = authenticators;
        this.credentialStore = credentialStore;
    }
    getNextRequest = () => {
        return this.pendingRequest.promise;
    };
    async *invokeAuthenticator() {
        for (const authenticator of this.authenticators) {
            for await (const packet of authenticator(this.credentialStore, this.getNextRequest)) {
                // If the authenticator yielded a response
                // Prepare `nextRequest` for next authentication request
                this.pendingRequest = new PromiseResolver();
                // Yield the response to outer layer
                yield packet;
            }
            // If the authenticator returned,
            // Next authenticator will be given the same `pendingRequest`
        }
    }
    async process(packet) {
        if (!this.iterator) {
            this.iterator = this.invokeAuthenticator();
        }
        this.pendingRequest.resolve(packet);
        const result = await this.iterator.next();
        if (result.done) {
            throw new Error("No authenticator can handle the request");
        }
        return result.value;
    }
    dispose() {
        void this.iterator?.return?.();
    }
}
//# sourceMappingURL=auth.js.map