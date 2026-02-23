# 2.2.0

* Add `delay` util function.

# 2.1.4

* `PromiseResolver#resolve` and `PromiseResolver#reject` are automatically bind to instance.

# 2.1.1

* Add ESModule output.

# 2.1.0

* **[Breaking Change]** `value` parameter of `PromiseResolver#resolve` is no longer optional. See [Microsoft/TypeScript#39817](https://github.com/microsoft/TypeScript/pull/39817).

# 2.0.0

* **[Breaking Change]** Add tuple item name to the return type of `AsyncOperationManager#add`. Requires TypeScript 4+.
