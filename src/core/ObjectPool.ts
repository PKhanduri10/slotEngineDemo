export class ObjectPool<T> {
    private pool: T[] = [];
    private createFn: () => T;
    private resetFn?: (item: T) => void;

    constructor(createFn: () => T, resetFn?: (item: T) => void, initialSize: number = 20) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.preallocate(initialSize);
    }

    private preallocate(count: number): void {
        for (let i = 0; i < count; i++) {
            this.pool.push(this.createFn());
        }
    }

    public get(): T {
        if (this.pool.length === 0) {
            return this.createFn();
        }
        return this.pool.pop()!;
    }

    public release(item: T): void {
        if (this.resetFn) {
            this.resetFn(item);
        }
        this.pool.push(item);
    }

    public get size(): number {
        return this.pool.length;
    }
}