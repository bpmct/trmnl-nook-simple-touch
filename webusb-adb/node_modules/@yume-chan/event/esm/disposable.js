export class AutoDisposable {
    #disposables = [];
    constructor() {
        this.dispose = this.dispose.bind(this);
    }
    addDisposable(disposable) {
        this.#disposables.push(disposable);
        return disposable;
    }
    dispose() {
        for (const disposable of this.#disposables) {
            disposable.dispose();
        }
        this.#disposables = [];
    }
}
export class DisposableList extends AutoDisposable {
    add(disposable) {
        return this.addDisposable(disposable);
    }
}
//# sourceMappingURL=disposable.js.map