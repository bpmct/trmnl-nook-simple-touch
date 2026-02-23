export const AdbBannerKey = {
    Product: "ro.product.name",
    Model: "ro.product.model",
    Device: "ro.product.device",
    Features: "features",
};
export class AdbBanner {
    static parse(banner) {
        let product;
        let model;
        let device;
        let features = [];
        const pieces = banner.split("::");
        if (pieces.length > 1) {
            const props = pieces[1];
            for (const prop of props.split(";")) {
                // istanbul ignore if
                if (!prop) {
                    continue;
                }
                const keyValue = prop.split("=");
                if (keyValue.length !== 2) {
                    continue;
                }
                const [key, value] = keyValue;
                switch (key) {
                    case AdbBannerKey.Product:
                        product = value;
                        break;
                    case AdbBannerKey.Model:
                        model = value;
                        break;
                    case AdbBannerKey.Device:
                        device = value;
                        break;
                    case AdbBannerKey.Features:
                        features = value.split(",");
                        break;
                }
            }
        }
        return new AdbBanner(product, model, device, features);
    }
    #product;
    get product() {
        return this.#product;
    }
    #model;
    get model() {
        return this.#model;
    }
    #device;
    get device() {
        return this.#device;
    }
    #features = [];
    get features() {
        return this.#features;
    }
    constructor(product, model, device, features) {
        this.#product = product;
        this.#model = model;
        this.#device = device;
        this.#features = features;
    }
}
//# sourceMappingURL=banner.js.map