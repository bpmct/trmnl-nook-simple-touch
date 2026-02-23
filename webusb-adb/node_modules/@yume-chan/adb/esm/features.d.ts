export declare const AdbFeature: {
    readonly ShellV2: "shell_v2";
    readonly Cmd: "cmd";
    readonly StatV2: "stat_v2";
    readonly ListV2: "ls_v2";
    readonly FixedPushMkdir: "fixed_push_mkdir";
    readonly Abb: "abb";
    readonly AbbExec: "abb_exec";
    readonly SendReceiveV2: "sendrecv_v2";
    readonly DelayedAck: "delayed_ack";
};
export type AdbFeature = (typeof AdbFeature)[keyof typeof AdbFeature];
//# sourceMappingURL=features.d.ts.map