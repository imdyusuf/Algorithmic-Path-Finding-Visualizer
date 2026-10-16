/**
 * Simple FIFO queue implemented with a JS array plus a head index pointer
 * to avoid O(n) shifts on large dequeues.
 */
export class Queue<T> {
  private items: T[] = [];
  private head = 0;

  get size(): number {
    return this.items.length - this.head;
  }

  isEmpty(): boolean {
    return this.head >= this.items.length;
  }

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head];
    this.head++;
    // Periodically compact the array to free memory
    if (this.head > 1024 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.head];
  }

  clear(): void {
    this.items = [];
    this.head = 0;
  }
}
