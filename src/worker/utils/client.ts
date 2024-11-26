import type {
  RpcResponse,
  ServerMethods,
  Arguments,
  ReturnTypePerformanceResult,
} from "./type";
import { IS_PROD, IS_VITE } from "@/const";

const loop = () => { };

interface RpcInstance {
  postMessage: (
    data: any,
    opt?: {
      transfer: Transferable[];
    }
  ) => void;
}

class Lock {
  protected status1 = {
    lock: false,
    resolve: loop,
    reject: loop,
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

export abstract class RpcClient<T extends ServerMethods> extends Lock {
  abstract instance: RpcInstance;
  private requestId = 0;

  constructor() {
    super();
    this.lock();
  }

  private callbackMap = new Map<
    number,
    [resolve: (data: any) => void, reject: (err: any) => void]
  >();

  onMessage(e: MessageEvent) {
    if (!e.data) {
      return;
    }

    const data = e.data as RpcResponse;
    if (data.name === "READY") {
      this.unlock();
      return;
    }

    const item = this.callbackMap.get(data.requestId);
    if (!item) {
      return;
    }

    if (data.failed) {
      item[1](data.data);
      return;
    }
    item[0](data.data);
    this.callbackMap.delete(data.requestId);
  }

  callRemote<K extends keyof T["fns"]>(
    name: K,
    args: Arguments<T["fns"][K]>,
    transport?: Transferable[]
  ): Promise<Awaited<ReturnType<T["fns"][K]>>>;

  callRemote<K extends keyof T["pfns"]>(
    name: K,
    args: Arguments<T["pfns"][K]>,
    transport?: Transferable[]
  ): Promise<Awaited<ReturnTypePerformanceResult<T["pfns"][K]>>>;

  async callRemote<T>(
    name: string,
    args: any[] = [],
    transport: Transferable[] = []
  ) {
    await this.status;

    const sid = this.requestId++;
    if (!IS_PROD) {
      console.log(`start call remote ${name}: ${sid}`);
    }
    this.instance.postMessage(
      {
        requestId: sid,
        name,
        args,
      },
      { transfer: transport }
    );

    return new Promise<T>((resolve, reject) => {
      this.callbackMap.set(sid, [resolve, reject]);
    });
  }

  abstract dispose(): void;
}

export class WorkerClient<T extends ServerMethods> extends RpcClient<T> {
  instance: Worker;

  constructor(workerUrl: URL | string, opt?: WorkerOptions) {
    super();

    if (IS_VITE) {
      this.instance = new Worker(workerUrl, {
        ...opt,
        type: "module",
      });
    } else {
      const blob = new Blob([`importScripts("${workerUrl}");`], {
        type: "application/javascript",
      });
      const URL = window.URL || window.webkitURL;
      this.instance = new Worker(URL.createObjectURL(blob), opt);
    }

    this.onMessage = this.onMessage.bind(this);
    this.instance.addEventListener("message", this.onMessage);
  }

  dispose() {
    this.instance.removeEventListener("message", this.onMessage);
    this.instance.terminate();
  }
}

export class IfreamClient<T extends ServerMethods> extends RpcClient<T> {
  instance: NonNullable<HTMLIFrameElement["contentWindow"]>;
  constructor(ifream: HTMLIFrameElement) {
    super();

    this.instance = ifream.contentWindow!;

    this.onMessage = this.onMessage.bind(this);
    self.addEventListener("message", this.onMessage);
  }

  dispose(): void {
    self.removeEventListener("message", this.onMessage);
  }
}
