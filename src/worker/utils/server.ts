import type { RpcRequest, ServerMethods } from "./type";

export abstract class RpcServer<T extends ServerMethods> {
  private fn: ServerMethods["fns"];
  private performanceFn: ServerMethods["pfns"];
  dev = false;
  constructor(options: T) {
    this.fn = options.fns;
    this.performanceFn = options.pfns;
    this.init();
  }

  abstract sendToRemote(data: any, transfer?: Transferable[]): void;
  
  init() {
    const callPerformanceFn = this.callPerformanceFn.bind(this);
    const callFn = this.callFn.bind(this);

    self.addEventListener("message", async (e) => {
      const data = e.data as RpcRequest | undefined;
      if (!data || !data.name) {
        return;
      }

      const list = [callPerformanceFn, callFn];
      const start = performance.now();

      let isSuccess = false;
      for (const fn of list) {
        const status = await fn.call(this, data);
        if (status !== false) {
          isSuccess = true;
          break;
        }
      }
      
      if (isSuccess) {
        if (this.dev) {
          console.log(
            `callremote ${data.name} use ${performance.now() - start} ms`
          );
        }
        return;
      }
      
      if (this.dev) {
        console.log(`call method ${data.name} not found`);
      }
      
      self.postMessage({
        name: data.name,
        requestId: data.requestId,
        data: "field",
        failed: true,
      });
    });

    self.addEventListener("error", (err) => {
      console.log("unhandle worker error", err);
    });

    if (this.dev) {
      console.log(`${self.name} is ready`);
    }

    this.sendToRemote({
      name: "READY",
      requestId: -1,
      data: null,
    });
  }

  private async callPerformanceFn(data: RpcRequest) {
    const { name, requestId, args } = data;
    const fn = this.performanceFn[name];
    if (
      !Object.prototype.hasOwnProperty.call(this.performanceFn, name) ||
      typeof fn !== "function"
    ) {
      return false;
    }
    try {
      const res = await fn.apply(self, args);
      this.sendToRemote(
        {
          name,
          requestId,
          data: res[0],
        },
        res[1]
      );
    } catch (err) {
      this.sendToRemote({
        name,
        requestId,
        data: err,
        failed: true,
      });
    }
    return true;
  }

  private async callFn(data: RpcRequest) {
    const { name, requestId, args } = data;
    const fn = this.fn[name];
    if (
      !Object.prototype.hasOwnProperty.call(this.fn, name) ||
      typeof fn !== "function"
    ) {
      return false;
    }

    try {
      const res = await fn.apply(self, args);
      this.sendToRemote({
        name,
        requestId,
        data: res,
      });
    } catch (err) {
      this.sendToRemote({
        name,
        requestId,
        data: err,
        failed: true,
      });
    }
    return true;
  }
}

export class WorkerServer<T extends ServerMethods> extends RpcServer<T> {
  sendToRemote(data: any, transfer?: Transferable[] | undefined): void {
    self.postMessage(data, { transfer });
  }
}

export class IfreamServer<T extends ServerMethods> extends RpcServer<T> {
  sendToRemote(data: any, transfer?: Transferable[] | undefined): void {
    self.parent?.postMessage(data, {
      transfer,
    });
  }
}
