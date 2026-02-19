/**
 * In-memory CDML content cache for diff-based change detection.
 */

export class CdmlCache {
  private entries = new Map<string, string>();

  get(key: string): string | undefined {
    return this.entries.get(key);
  }

  set(key: string, content: string): void {
    this.entries.set(key, content);
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
