/**
 * An object to keep current Node.js process alive even when no code is running.
 *
 * Does nothing in Web environments.
 *
 * Note that it does't have reference counting. Calling `unref` will
 * remove the ref no matter how many times `ref` has been previously called, and vice versa.
 * This is the same as how Node.js works.
 */
export declare class Ref {
    #private;
    constructor(options?: {
        unref?: boolean | undefined;
    });
    ref(): void;
    unref(): void;
}
//# sourceMappingURL=ref.d.ts.map