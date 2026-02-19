/**
 * In-memory CDML content cache for diff-based change detection.
 */
export class CdmlCache {
    entries = new Map();
    get(key) {
        return this.entries.get(key);
    }
    set(key, content) {
        this.entries.set(key, content);
    }
    has(key) {
        return this.entries.has(key);
    }
    delete(key) {
        return this.entries.delete(key);
    }
    clear() {
        this.entries.clear();
    }
}
//# sourceMappingURL=cache.js.map