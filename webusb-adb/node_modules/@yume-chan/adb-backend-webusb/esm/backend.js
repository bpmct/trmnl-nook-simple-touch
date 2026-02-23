import { AdbPacketHeader, AdbPacketSerializeStream } from "@yume-chan/adb";
import { ConsumableWritableStream, DuplexStreamFactory, ReadableStream, pipeFrom, } from "@yume-chan/stream-extra";
import { EMPTY_UINT8_ARRAY } from "@yume-chan/struct";
/**
 * The default filter for ADB devices, as defined by Google.
 */
export const ADB_DEFAULT_DEVICE_FILTER = {
    classCode: 0xff,
    subclassCode: 0x42,
    protocolCode: 1,
};
function alternateMatchesFilter(alternate, filters) {
    return filters.some((filter) => alternate.interfaceClass === filter.classCode &&
        alternate.interfaceSubclass === filter.subclassCode &&
        alternate.interfaceProtocol === filter.protocolCode);
}
function findUsbAlternateInterface(device, filters) {
    for (const configuration of device.configurations) {
        for (const interface_ of configuration.interfaces) {
            for (const alternate of interface_.alternates) {
                if (alternateMatchesFilter(alternate, filters)) {
                    return { configuration, interface_, alternate };
                }
            }
        }
    }
    throw new Error("No matched alternate interface found");
}
/**
 * Find the first pair of input and output endpoints from an alternate interface.
 *
 * ADB interface only has two endpoints, one for input and one for output.
 */
function findUsbEndpoints(endpoints) {
    if (endpoints.length === 0) {
        throw new Error("No endpoints given");
    }
    let inEndpoint;
    let outEndpoint;
    for (const endpoint of endpoints) {
        switch (endpoint.direction) {
            case "in":
                inEndpoint = endpoint;
                if (outEndpoint) {
                    return { inEndpoint, outEndpoint };
                }
                break;
            case "out":
                outEndpoint = endpoint;
                if (inEndpoint) {
                    return { inEndpoint, outEndpoint };
                }
                break;
        }
    }
    if (!inEndpoint) {
        throw new Error("No input endpoint found.");
    }
    if (!outEndpoint) {
        throw new Error("No output endpoint found.");
    }
    throw new Error("unreachable");
}
class Uint8ArrayStructDeserializeStream {
    buffer;
    offset;
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }
    read(length) {
        const result = this.buffer.subarray(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
}
export class AdbWebUsbBackendStream {
    _readable;
    get readable() {
        return this._readable;
    }
    _writable;
    get writable() {
        return this._writable;
    }
    constructor(device, inEndpoint, outEndpoint, usbManager) {
        let closed = false;
        const factory = new DuplexStreamFactory({
            close: async () => {
                try {
                    closed = true;
                    await device.close();
                }
                catch {
                    /* device may have already disconnected */
                }
            },
            dispose: () => {
                usbManager.removeEventListener("disconnect", handleUsbDisconnect);
            },
        });
        function handleUsbDisconnect(e) {
            if (e.device === device) {
                factory.dispose().catch((e) => {
                    void e;
                });
            }
        }
        usbManager.addEventListener("disconnect", handleUsbDisconnect);
        this._readable = factory.wrapReadable(new ReadableStream({
            async pull(controller) {
                // The `length` argument in `transferIn` must not be smaller than what the device sent,
                // otherwise it will return `babble` status without any data.
                // Here we read exactly 24 bytes (packet header) followed by exactly `payloadLength`.
                const result = await device.transferIn(inEndpoint.endpointNumber, 24);
                // TODO: webusb: handle `babble` by discarding the data and receive again
                // TODO: webusb: on Windows, `transferIn` throws an NetworkError when device disconnected, check with other OSs.
                // From spec, the `result.data` always covers the whole `buffer`.
                const buffer = new Uint8Array(result.data.buffer);
                const stream = new Uint8ArrayStructDeserializeStream(buffer);
                // Add `payload` field to its type, because we will assign `payload` in next step.
                const packet = AdbPacketHeader.deserialize(stream);
                if (packet.payloadLength !== 0) {
                    const result = await device.transferIn(inEndpoint.endpointNumber, packet.payloadLength);
                    packet.payload = new Uint8Array(result.data.buffer);
                }
                else {
                    packet.payload = EMPTY_UINT8_ARRAY;
                }
                controller.enqueue(packet);
            },
        }));
        const zeroMask = outEndpoint.packetSize - 1;
        this._writable = pipeFrom(factory.createWritable(new ConsumableWritableStream({
            write: async (chunk) => {
                try {
                    await device.transferOut(outEndpoint.endpointNumber, chunk);
                    if (zeroMask &&
                        (chunk.byteLength & zeroMask) === 0) {
                        await device.transferOut(outEndpoint.endpointNumber, EMPTY_UINT8_ARRAY);
                    }
                }
                catch (e) {
                    if (closed) {
                        return;
                    }
                    throw e;
                }
            },
        })), new AdbPacketSerializeStream());
    }
}
export class AdbWebUsbBackend {
    _filters;
    _usb;
    _device;
    get device() {
        return this._device;
    }
    get serial() {
        return this._device.serialNumber;
    }
    get name() {
        return this._device.productName;
    }
    /**
     * Create a new instance of `AdbWebBackend` using a specified `USBDevice` instance
     *
     * @param device The `USBDevice` instance obtained elsewhere.
     * @param filters The filters to use when searching for ADB interface. Defaults to {@link ADB_DEFAULT_DEVICE_FILTER}.
     */
    constructor(device, filters = [ADB_DEFAULT_DEVICE_FILTER], usb) {
        this._device = device;
        this._filters = filters;
        this._usb = usb;
    }
    /**
     * Claim the device and create a pair of `AdbPacket` streams to the ADB interface.
     * @returns The pair of `AdbPacket` streams.
     */
    async connect() {
        if (!this._device.opened) {
            await this._device.open();
        }
        const { configuration, interface_, alternate } = findUsbAlternateInterface(this._device, this._filters);
        if (this._device.configuration?.configurationValue !==
            configuration.configurationValue) {
            // Note: Switching configuration is not supported on Windows,
            // but Android devices should always expose ADB function at the first (default) configuration.
            await this._device.selectConfiguration(configuration.configurationValue);
        }
        if (!interface_.claimed) {
            await this._device.claimInterface(interface_.interfaceNumber);
        }
        if (interface_.alternate.alternateSetting !== alternate.alternateSetting) {
            await this._device.selectAlternateInterface(interface_.interfaceNumber, alternate.alternateSetting);
        }
        const { inEndpoint, outEndpoint } = findUsbEndpoints(alternate.endpoints);
        return new AdbWebUsbBackendStream(this._device, inEndpoint, outEndpoint, this._usb);
    }
}
//# sourceMappingURL=backend.js.map