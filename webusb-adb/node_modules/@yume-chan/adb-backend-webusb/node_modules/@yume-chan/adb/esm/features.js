// The order follows
// https://android.googlesource.com/platform/packages/modules/adb/+/79010dc6d5ca7490c493df800d4421730f5466ca/transport.cpp#1252
export var AdbFeature;
(function (AdbFeature) {
    AdbFeature["ShellV2"] = "shell_v2";
    AdbFeature["Cmd"] = "cmd";
    AdbFeature["StatV2"] = "stat_v2";
    AdbFeature["ListV2"] = "ls_v2";
    AdbFeature["FixedPushMkdir"] = "fixed_push_mkdir";
    AdbFeature["Abb"] = "abb";
    AdbFeature["AbbExec"] = "abb_exec";
    AdbFeature["SendReceiveV2"] = "sendrecv_v2";
})(AdbFeature = AdbFeature || (AdbFeature = {}));
//# sourceMappingURL=features.js.map