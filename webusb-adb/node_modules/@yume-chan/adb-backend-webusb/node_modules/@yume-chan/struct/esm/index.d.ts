declare global {
    interface ArrayBuffer {
        __brand: never;
    }
    interface SharedArrayBuffer {
        __brand: never;
    }
}
export * from "./basic/index.js";
export * from "./struct.js";
export { Struct as default } from "./struct.js";
export * from "./types/index.js";
export * from "./utils.js";
//# sourceMappingURL=index.d.ts.map