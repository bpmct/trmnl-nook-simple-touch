export interface Task {
    run<T>(callback: () => T): T;
}
export declare const createTask: (name: string) => Task;
//# sourceMappingURL=task.d.ts.map