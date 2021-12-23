class QuickUnion {
  size: number[];
  set: number[];
  constructor(readonly length: number) {
    this.size = new Array(length);
    this.set = new Array(length);

    for (var i = 0; i < length; i++) {
      this.size[i] = 1;
      this.set[i] = i;
    }
  }

  join(p: number, q: number) {
    var proot = this.find(p);
    var qroot = this.find(q);
    if (proot == qroot) return;

    if (this.size[proot] < this.size[qroot]) {
      this.set[proot] = qroot;
      this.size[qroot] += this.size[proot];
    } else {
      this.set[qroot] = proot;
      this.size[proot] += this.size[qroot];
    }
  }

  connected(p: number, q: number) {
    var proot = this.find(p);
    var qroot = this.find(q);
    if (proot == qroot) {
      return true;
    } else {
      return false;
    }
  }

  find(index: number) {
    var root = this.set[index];

    while (root != this.set[root]) {
      root = this.set[root];
    }
    this.set[index] = root;
    return root;
  }

}

export default QuickUnion;