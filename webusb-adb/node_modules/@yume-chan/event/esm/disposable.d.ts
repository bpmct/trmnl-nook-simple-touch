export interface Disposable {
    dispose(): void;
}
export declare class AutoDisposable implements Disposable {
    #private;
    constructor();
    protected addDisposable<T extends Disposable>(disposable: T): T;
    dispose(): void;
}
export declare class DisposableList extends AutoDisposable {
    add<T extends Disposable>(disposable: T): T;
}
//# sourceMappingURL=disposable.d.ts.map