export class Lock {
  protected status1 = {
    lock: false,
    resolve: () => { },
    reject: () => { },
  };
  status = Promise.resolve();
  private createPromise() {
    let resolve!: () => void, reject!: () => void;
    const p = new Promise<void>((res, rej) => {
      reject = rej;
      resolve = res;
    });
    return { resolve, reject, p };
  }

  lock() {
    if (this.status1.lock) {
      return;
    }
    const { resolve, reject, p } = this.createPromise();
    this.status = p;
    this.status1 = {
      lock: true,
      resolve,
      reject,
    };
  }

  unlock() {
    if (!this.status1.lock) {
      return;
    }
    this.status1.lock = false;
    this.status1.resolve();
  }
}