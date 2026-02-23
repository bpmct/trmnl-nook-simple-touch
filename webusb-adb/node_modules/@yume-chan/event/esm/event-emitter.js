export class EventEmitter {
    listeners = [];
    constructor() {
        this.event = this.event.bind(this);
    }
    addEventListener(info) {
        this.listeners.push(info);
        const remove = () => {
            const index = this.listeners.indexOf(info);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        };
        remove.dispose = remove;
        return remove;
    }
    event = (listener, thisArg, ...args) => {
        const info = {
            listener: listener,
            thisArg,
            args,
        };
        return this.addEventListener(info);
    };
    fire(e) {
        for (const info of this.listeners.slice()) {
            info.listener.call(info.thisArg, e, ...info.args);
        }
    }
    dispose() {
        this.listeners.length = 0;
    }
}
//# sourceMappingURL=event-emitter.js.map