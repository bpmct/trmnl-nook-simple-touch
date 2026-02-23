import type { AdbFeature } from "./features.js";
export declare const AdbBannerKey: {
    readonly Product: "ro.product.name";
    readonly Model: "ro.product.model";
    readonly Device: "ro.product.device";
    readonly Features: "features";
};
export type AdbBannerKey = (typeof AdbBannerKey)[keyof typeof AdbBannerKey];
export declare class AdbBanner {
    #private;
    static parse(banner: string): AdbBanner;
    get product(): string | undefined;
    get model(): string | undefined;
    get device(): string | undefined;
    get features(): readonly AdbFeature[];
    constructor(product: string | undefined, model: string | undefined, device: string | undefined, features: readonly AdbFeature[]);
}
//# sourceMappingURL=banner.d.ts.map