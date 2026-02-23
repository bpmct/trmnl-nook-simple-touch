import type { Disposable } from "@yume-chan/event";
export declare class ConditionalVariable implements Disposable {
    private _locked;
    private readonly _queue;
    wait(condition: () => boolean): Promise<void>;
    notifyOne(): void;
    dispose(): void;
}
//# sourceMappingURL=conditional-variable.d.ts.map