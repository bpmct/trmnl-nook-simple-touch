import type { Disposable } from "./disposable.js";
import type { EventListener, RemoveEventListener } from "./event.js";
export interface EventListenerInfo<TEvent, TResult = unknown> {
    listener: EventListener<TEvent, unknown, unknown[], TResult>;
    thisArg: unknown;
    args: unknown[];
}
export interface AddEventListener<TEvent, TResult = unknown> {
    (listener: EventListener<TEvent, unknown, [], TResult>): RemoveEventListener;
    <TThis, TArgs extends unknown[]>(listener: EventListener<TEvent, TThis, TArgs, TResult>, thisArg: TThis, ...args: TArgs): RemoveEventListener;
}
export declare class EventEmitter<TEvent, TResult = unknown> implements Disposable {
    protected readonly listeners: EventListenerInfo<TEvent, TResult>[];
    constructor();
    protected addEventListener(info: EventListenerInfo<TEvent, TResult>): RemoveEventListener;
    event: AddEventListener<TEvent, TResult>;
    fire(e: TEvent): void;
    dispose(): void;
}
//# sourceMappingURL=event-emitter.d.ts.map