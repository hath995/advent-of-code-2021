class Bag<T> {
  collection: Map<T, number>;
  constructor(...items: T[]) {
    this.collection = new Map();
    for (let item of items) {
      this.add(item);
    }
  }

  add(item: T, count: number = 1) {
    if (!this.collection.has(item)) {
      this.collection.set(item, count);
    } else {
      this.collection.set(item, this.collection.get(item)! + count);
    }
  }

  remove(item: T, count: number = 1) {
    if (this.collection.has(item) && this.collection.get(item)! > 0) {
      this.collection.set(item, Math.max(this.collection.get(item)! - count, 0));
    }
  }

  removeAll(item: T) {
    if (this.collection.has(item) && this.get(item) > 0) {
      this.collection.set(item, 0);
    }
  }

  size(): number {
    let result = 0;
    for (let item of this.collection.keys()) {
      result += this.get(item);
    }
    return result;
  }

  clone(): Bag<T> {
    let result = new Bag<T>();
    for (let [item, count] of this.entries()) {
      result.set(item, count);
    }
    return result;
  }

  has(item: T) {
    return this.collection.has(item) && this.get(item) > 0;
  }

  set(item: T, count: number) {
    this.collection.set(item, count);
    return count;
  }

  get(item: T) {
    let count = this.collection.get(item);
    return count ? count : 0;
  }

  sum(other_bag: Bag<T>): Bag<T> {
    let result = this.clone();
    for (let item of other_bag.collection.keys()) {
      if (result.has(item)) {
        result.collection.set(item, this.get(item) + other_bag.get(item));
      } else {
        result.collection.set(item, other_bag.get(item));
      }
    }
    return result;
  }

  intersect(other_bag: Bag<T>): Bag<T> {
    let result = new Bag<T>();
    for (let item of this.collection.keys()) {
      let count = Math.min(this.get(item), other_bag.get(item));
      if (count > 0) result.collection.set(item, count);
    }
    return result;
  }

  union(other_bag: Bag<T>): Bag<T> {
    let result = new Bag<T>();
    for (let item of this.collection.keys()) {
      let count = Math.max(this.get(item), other_bag.get(item));
      if (count > 0) result.collection.set(item, count);
    }

    for (let item of other_bag.collection.keys()) {
      let count = Math.max(this.get(item), other_bag.get(item));
      if (count > 0) result.collection.set(item, count);
    }
    return result;
  }

  equal(other_bag: Bag<T>): boolean {
    if (this.size() === other_bag.size()) {
      let result = true;
      for (let item of this.collection.keys()) {
        result = result && other_bag.get(item) === this.get(item);
        if (!result) break;
      }
      return result;
    }
    return false;
  }

  difference(other_bag: Bag<T>): Bag<T> {
    let result = new Bag(...this);
    for (let item of other_bag.collection.keys()) {
      let count = Math.max(this.get(item) - other_bag.get(item), 0);
      if (count >= 0) result.collection.set(item, count);
    }
    return result;
  }

  symmetricDifference(other_bag: Bag<T>): Bag<T> {
    //   return this.difference(other_bag).union(other_bag.difference(this));
    let result = new Bag<T>();
    for (let item of this.collection.keys()) {
      if (!other_bag.has(item)) {
        result.collection.set(item, this.get(item));
      }
    }
    for (let item of other_bag.collection.keys()) {
      if (!this.has(item)) {
        result.collection.set(item, other_bag.get(item));
      }
    }
    return result;
  }

  toSet(): Set<T> {
    return new Set(this.collection.keys());
  }

  *entries() {
    yield* this.collection.entries();
  }

  *[Symbol.iterator]() {
    for (let item of this.collection.keys()) {
      const n = this.collection.get(item)!;
      for (let i = 0; i < n; i++) {
        yield item;
      }
    }
  }
}

// let A = new Bag(...["a", "a", "b", "c", "a"]);
// let B = new Bag(...["a", "b", "d", "d"]);

// console.log(Array.from(A.entries()));

export default Bag;