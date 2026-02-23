export declare const AdbSyncRequestId: {
    readonly List: number;
    readonly ListV2: number;
    readonly Send: number;
    readonly SendV2: number;
    readonly Lstat: number;
    readonly Stat: number;
    readonly LstatV2: number;
    readonly Data: number;
    readonly Done: number;
    readonly Receive: number;
};
export declare const AdbSyncNumberRequest: import("@yume-chan/struct").Struct<{
    id: import("@yume-chan/struct").NumberField<number>;
    arg: import("@yume-chan/struct").NumberField<number>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    id: import("@yume-chan/struct").NumberField<number>;
    arg: import("@yume-chan/struct").NumberField<number>;
}>>;
export interface AdbSyncWritable {
    write(buffer: Uint8Array): Promise<void>;
}
export declare function adbSyncWriteRequest(writable: AdbSyncWritable, id: number | string, value: number | string | Uint8Array): Promise<void>;
//# sourceMappingURL=request.d.ts.map