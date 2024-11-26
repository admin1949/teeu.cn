import {
  type RpcResponse,
  type ServerMethods,
  type Arguments,
  type Returned,
  READY_REQUEST_ID,
  RpcRequest,
} from "./type";
import { Lock } from "./lock";

interface WorkPoolItem {
  lock: Lock;
  instance: Worker;
  busy: boolean;
  onMessage: (e: MessageEvent) => void
}

export class WorkerClient<T extends ServerMethods> {
  private pools: WorkPoolItem[] = [];
  private requestId = 0;

  constructor(url: URL | string, opt: WorkerOptions & { pool?: number } = {}) {
    let poolNums = Math.floor(opt.pool || 1);
    if (poolNums <= 0) {
      poolNums = 1;
    }
    
    this.pools = Array.from({ length: poolNums }, (_, idx) => {
      url.toString().split("/").slice(-1)[0]
      const name = poolNums === 1 ? opt?.name : `${opt?.name || url.toString().split("/").slice(-1)[0]}-${idx}`;
      const instance = new Worker(url, {
        ...opt,
        name,
      });
      const workPoolItem = {
        instance,
        lock: new Lock,
        busy: false,
      } as WorkPoolItem;
      
      const onMessage = this.onMessage.bind(this, workPoolItem);
      workPoolItem.onMessage = onMessage;
      instance.addEventListener('message', onMessage);
      
      return workPoolItem;
    });
  }

  private callbackMap = new Map<
    number,
    [resolve: (data: any) => void, reject: (err: any) => void]
  >();

  private onMessage(workPoolItem: WorkPoolItem,  e: MessageEvent) {
    if (!e.data) {
      return;
    }

    const data = e.data as RpcResponse;
    if (data.requestId === READY_REQUEST_ID) {
      workPoolItem.lock.unlock();
      return;
    }
    
    workPoolItem.busy = false;
    const item = this.callbackMap.get(data.requestId);
    if (item) {
      const cb = data.failed ? item[1] : item[0];
      cb(data.data);
    }

    this.callbackMap.delete(data.requestId);
    this.queueTask();
  }
  
  private queue: { data: RpcRequest, transfer?: Transferable[] }[] = [];
  queueTask() {
    const task = this.queue[0];
    if (!task) {
      return;
    }
    const poolSize = this.pools.length;
    if (poolSize === 1) {
      this.queue.shift();
      this.sendToRemote(this.pools[0], task.data, task.transfer);
      return;
    }
    
    for (let i = 0; i < poolSize; i++) {
      const item = this.pools[i];
      if (item.busy) {
        continue;
      }
      this.queue.shift();
      this.sendToRemote(item, task.data, task.transfer);
      break;
    }
  }
  
  protected addTask(data: RpcRequest, transfer?: Transferable[]) {
    this.queue.push({ data, transfer });
    this.queueTask();
  };
  
  protected async sendToRemote(instance: WorkPoolItem, data: RpcRequest, transfer?: Transferable[]) {
    instance.busy = true;
    await instance.lock.status
    instance.instance.postMessage(data, { transfer });
  };

  async callRemote<K extends (keyof T) & string>(
    name: K,
    args: Arguments<T[K]>,
    transport?: Transferable[]
  ): Promise<Returned<T[K]>> {

    const sid = this.requestId++;
    this.addTask(
      {
        name,
        args,
        requestId: sid,
      },
      transport
    );

    return new Promise<Returned<T[K]>>((resolve, reject) => {
      this.callbackMap.set(sid, [resolve, reject]);
    });
  }

  dispose() {
    this.pools.forEach(item => {
      item.instance.terminate();
      item.instance.removeEventListener("message", item.onMessage);
    });
    this.pools.length = 0;
  };
}

