export function delay(time: number): Promise<void> {
    return new Promise<void>(resolve => {
        // Don't call `resolve` with any value.
        (globalThis as any).setTimeout(() => resolve(), time);
    });
}
