import {
  type RpcResponse,
  type ServerMethods,
  type Arguments,
  READY_REQUEST_ID,
  RpcRequest,
} from "./type";
import { Lock } from "./lock";

export class WorkerClient<T extends ServerMethods> {
  instance: Worker;
  private requestId = 0;
  lock = new Lock()

  constructor(url: URL | string, opt: WorkerOptions) {
    this.lock.lock();
    
    this.instance = new Worker(url, opt);
    this.onMessage = this.onMessage.bind(this);
    this.instance.addEventListener("message", this.onMessage);
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
    if (data.requestId === READY_REQUEST_ID) {
      this.lock.unlock();
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
  
  sendToRemote(data: RpcRequest, transfer?: Transferable[]) {
    this.instance.postMessage(data, { transfer });
  };

  async callRemote<K extends (keyof T) & string>(
    name: K,
    args: Arguments<T[K]>,
    transport?: Transferable[]
  ): Promise<Awaited<ReturnType<T[K]>>> {

    await this.lock.status;

    const sid = this.requestId++;
    this.sendToRemote(
      {
        requestId: sid,
        name,
        args,
      },
      transport
    );

    return new Promise<Awaited<ReturnType<T[K]>>>((resolve, reject) => {
      this.callbackMap.set(sid, [resolve, reject]);
    });
  }

  dispose() {
    this.instance.removeEventListener("message", this.onMessage);
    this.instance.terminate();
  };
}

