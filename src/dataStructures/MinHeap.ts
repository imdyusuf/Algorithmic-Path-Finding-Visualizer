/**
 * Generic MinHeap / Priority Queue implementation.
 * Comparison is based on the priority value returned by the getPriority callback,
 * or the value itself if the item is a number.
 * For pathfinding, we store nodes along with their priority (distance or f-score).
 */

export interface HeapItem<T> {
  priority: number;
  value: T;
}

export class MinHeap<T> {
  private heap: HeapItem<T>[] = [];

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  insert(priority: number, value: T): void {
    this.heap.push({ priority, value });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): HeapItem<T> | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  /**
   * Update the priority of an element. When multiple entries exist for the same
   * value, we simply insert a new one with the lower priority. The old (higher
   * priority) entry will be ignored when it's later extracted because it will
   * already have been processed. This is a common pattern in Dijkstra/A* that
   * avoids an O(n) search for the element.
   */
  decreaseKey(value: T, newPriority: number): void {
    this.insert(newPriority, value);
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;

      if (
        leftChildIndex < length &&
        this.heap[leftChildIndex].priority < this.heap[smallest].priority
      ) {
        smallest = leftChildIndex;
      }
      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex].priority < this.heap[smallest].priority
      ) {
        smallest = rightChildIndex;
      }
      if (smallest === index) break;
      this.swap(smallest, index);
      index = smallest;
    }
  }

  private swap(a: number, b: number): void {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }
}
