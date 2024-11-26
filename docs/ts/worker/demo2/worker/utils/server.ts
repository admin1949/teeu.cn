import type { RpcRequest, RpcResponse, ServerMethods } from "./type";
import { READY_REQUEST_ID } from "./type";

const hasOwnProperty = (obj: unknown, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

export class WorkerServices<T extends ServerMethods> {
  dev = false;
  
  static instance: WorkerServices<ServerMethods> | null = null;
  
  constructor(private methods: T) {
    const instance = WorkerServices.instance;
    if (instance) {
      throw new Error("一个 worker 只能实例化一个 WorkerServices, 请检查代码");
    }
    this.init();
    WorkerServices.instance = this;
  }

  sendToRemote(data: RpcResponse, transfer?: Transferable[]) {
    self.postMessage(data, { transfer });
  };

  init() {
    self.addEventListener("message", async (e) => {
      const data = e.data as RpcRequest | undefined;
      if (!data || !data.name) {
        return;
      }
      
      const fn = this.methods[data.name];
      if (!hasOwnProperty(this.methods, data.name) || typeof fn !== "function") {
        this.sendToRemote({
          name: data.name,
          requestId: data.requestId,
          data: `method "${data.name}" not found`,
          failed: true,
        });
        return;
      }
      
      let res: unknown;
      let hasError = false;
      let transfer: Transferable[] = [];
      try {
        res = await fn.apply(this.methods, data.args || []);
      } catch (err) {
        hasError = true;
        res = err;
      }
      
      this.sendToRemote({
        name: data.name,
        requestId: data.requestId,
        data: res,
        failed: hasError,
      }, transfer);
    });

    self.addEventListener("error", (err) => {
      console.log("unhandle worker error", err);
    });

    if (this.dev) {
      console.log(`${self.name} is ready`);
    }

    this.sendToRemote({
      name: "READY",
      requestId: READY_REQUEST_ID,
      data: null,
    });
  }
}

