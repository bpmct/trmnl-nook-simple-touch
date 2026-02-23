import { EventEmitter, StickyEventEmitter } from "@yume-chan/event";
import { Ref } from "../utils/index.js";
import { AdbServerClient } from "./client.js";
export function unorderedRemove(array, index) {
    if (index < 0 || index >= array.length) {
        return;
    }
    array[index] = array[array.length - 1];
    array.length -= 1;
}
function filterDeviceStates(devices, states) {
    return devices.filter((device) => states.includes(device.state));
}
export class AdbServerDeviceObserverOwner {
    current = [];
    #client;
    #stream;
    #observers = [];
    constructor(client) {
        this.#client = client;
    }
    async #receive(stream) {
        const response = await stream.readString();
        const next = AdbServerClient.parseDeviceList(response);
        const removed = this.current.slice();
        const added = [];
        for (const nextDevice of next) {
            const index = removed.findIndex((device) => device.transportId === nextDevice.transportId);
            if (index === -1) {
                added.push(nextDevice);
                continue;
            }
            unorderedRemove(removed, index);
        }
        this.current = next;
        if (added.length) {
            for (const observer of this.#observers) {
                const filtered = filterDeviceStates(added, observer.includeStates);
                if (filtered.length) {
                    observer.onDeviceAdd.fire(filtered);
                }
            }
        }
        if (removed.length) {
            for (const observer of this.#observers) {
                const filtered = filterDeviceStates(removed, observer.includeStates);
                if (filtered.length) {
                    observer.onDeviceRemove.fire(removed);
                }
            }
        }
        for (const observer of this.#observers) {
            const filtered = filterDeviceStates(this.current, observer.includeStates);
            observer.onListChange.fire(filtered);
        }
    }
    async #receiveLoop(stream) {
        try {
            while (true) {
                await this.#receive(stream);
            }
        }
        catch (e) {
            this.#stream = undefined;
            for (const observer of this.#observers) {
                observer.onError.fire(e);
            }
        }
    }
    async #connect() {
        const stream = await this.#client.createConnection("host:track-devices-l", 
        // Each individual observer will ref depending on their options
        { unref: true });
        // Set `current` and `onListChange` value before returning
        await this.#receive(stream);
        // Then start receive loop
        void this.#receiveLoop(stream);
        return stream;
    }
    async #handleObserverStop(stream) {
        if (this.#observers.length === 0) {
            this.#stream = undefined;
            await stream.dispose();
        }
    }
    async createObserver(options) {
        options?.signal?.throwIfAborted();
        let current = [];
        const onDeviceAdd = new EventEmitter();
        const onDeviceRemove = new EventEmitter();
        const onListChange = new StickyEventEmitter();
        const onError = new StickyEventEmitter();
        const includeStates = options?.includeStates ?? [
            "device",
            "unauthorized",
        ];
        const observer = {
            includeStates,
            onDeviceAdd,
            onDeviceRemove,
            onListChange,
            onError,
        };
        // Register `observer` before `#connect`.
        // So `#handleObserverStop` knows if there is any observer.
        this.#observers.push(observer);
        // Read the filtered `current` value from `onListChange` event
        onListChange.event((value) => (current = value));
        let stream;
        if (!this.#stream) {
            // `#connect` will initialize `onListChange` and `current`
            this.#stream = this.#connect();
            try {
                stream = await this.#stream;
            }
            catch (e) {
                this.#stream = undefined;
                throw e;
            }
        }
        else {
            stream = await this.#stream;
            // Initialize `onListChange` and `current` ourselves
            onListChange.fire(filterDeviceStates(this.current, includeStates));
        }
        const ref = new Ref(options);
        const stop = async () => {
            unorderedRemove(this.#observers, this.#observers.indexOf(observer));
            await this.#handleObserverStop(stream);
            ref.unref();
        };
        if (options?.signal) {
            if (options.signal.aborted) {
                await stop();
                throw options.signal.reason;
            }
            options.signal.addEventListener("abort", () => void stop());
        }
        return {
            onDeviceAdd: onDeviceAdd.event,
            onDeviceRemove: onDeviceRemove.event,
            onListChange: onListChange.event,
            onError: onError.event,
            get current() {
                return current;
            },
            stop,
        };
    }
}
//# sourceMappingURL=observer.js.map