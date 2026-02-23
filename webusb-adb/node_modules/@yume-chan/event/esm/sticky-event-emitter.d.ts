import type { EventListenerInfo } from "./event-emitter.js";
import { EventEmitter } from "./event-emitter.js";
import type { RemoveEventListener } from "./event.js";
export declare class StickyEventEmitter<TEvent, TResult = unknown> extends EventEmitter<TEvent, TResult> {
    #private;
    protected addEventListener(info: EventListenerInfo<TEvent, TResult>): RemoveEventListener;
    fire(e: TEvent): void;
}
//# sourceMappingURL=sticky-event-emitter.d.ts.map