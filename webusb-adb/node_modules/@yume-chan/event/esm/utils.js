import { PromiseResolver } from "@yume-chan/async";
export async function once(event) {
    const resolver = new PromiseResolver();
    const dispose = event(resolver.resolve);
    const result = await resolver.promise;
    dispose();
    return result;
}
//# sourceMappingURL=utils.js.map