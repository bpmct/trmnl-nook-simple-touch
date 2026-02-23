import type { StructValue } from "@yume-chan/struct";
export declare const AdbShellProtocolId: {
    readonly Stdin: 0;
    readonly Stdout: 1;
    readonly Stderr: 2;
    readonly Exit: 3;
    readonly CloseStdin: 4;
    readonly WindowSizeChange: 5;
};
export type AdbShellProtocolId = (typeof AdbShellProtocolId)[keyof typeof AdbShellProtocolId];
export declare const AdbShellProtocolPacket: import("@yume-chan/struct").Struct<{
    id: import("@yume-chan/struct").Field<AdbShellProtocolId, never, never, number>;
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, string, never, Uint8Array<ArrayBufferLike>>;
}, undefined, import("@yume-chan/struct").FieldsValue<{
    id: import("@yume-chan/struct").Field<AdbShellProtocolId, never, never, number>;
    data: import("@yume-chan/struct").Field<Uint8Array<ArrayBufferLike>, string, never, Uint8Array<ArrayBufferLike>>;
}>>;
export type AdbShellProtocolPacket = StructValue<typeof AdbShellProtocolPacket>;
//# sourceMappingURL=shared.d.ts.map