/**
 * In-memory CDML content cache for diff-based change detection.
 */
export declare class CdmlCache {
    private entries;
    get(key: string): string | undefined;
    set(key: string, content: string): void;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map