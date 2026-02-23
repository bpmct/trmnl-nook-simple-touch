import type { Disposable } from "@yume-chan/event";
export declare class AutoResetEvent implements Disposable {
    private _set;
    private readonly _queue;
    constructor(initialSet?: boolean);
    wait(): Promise<void>;
    notifyOne(): void;
    dispose(): void;
}
//# sourceMappingURL=auto-reset-event.d.ts.map