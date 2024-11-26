# 如何优雅的在 Typescript 中使用 Web Worker

## 原生写法
通过 [MDN Worker 页面](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 的介绍，我们知道在浏览器中使用 Worker 的方式是直接 `new Worker("worker.js")`的方式，且工作线程和主线程之间的交互也很原始，如下是 MDN 提供的示例代码

```Javascript:line-numbers
// main.js
const myWorker = new Worker("worker.js");

const exec = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log('Message posted to worker');
}

myWorker.onmessage = function(e) {
  result.textContent = e.data;
  console.log('Message received from worker');
}
```

```Javascript:line-numbers
// worker.js
self.addEventListener("message", (e) => {
  console.log('Worker: Message received from main script');
  const result = e.data[0] * e.data[1];
  if (isNaN(result)) {
    postMessage('Worker Result: Please write two numbers');
  } else {
    const workerResult = 'Worker Result: ' + result;
    console.log('Worker: Posting message back to main script');
    postMessage(workerResult);
  }
})
```

### 基础示例
下面这个示例使用了 `Worker` 实现了 2 个数的相乘, 由于使用的是 vite，代码稍微有点区别，但是原理是一样的
<demo
  vue="./worker/demo1/index.vue" :vueFiles="['./worker/demo1/index.vue', './worker/demo1/worker.ts']"
  react="./worker/demo1/react-demo.tsx" :reactFiles="['./worker/demo1/react-demo.tsx', './worker/demo1/worker.ts']"
 />

通过分析代码我们可以看到原始的写法有以下这么几个问题

1. ~~`Worker` 代码加载是需要通过网络请求源代码的，如果请求还没完成就触发调用，那么这次调用就会被吞掉，埋了一个隐形的坑~~ 现代浏览器已经做了优化
2. 函数调用和返回是割裂的，不知到这次的返回值是什么时候触发调用的
3. 需要自己封装 `Worker` 来实现暴露出多个执行函数的功能
4. 如何设计，使其能够使用 `Typescript` 的类型系统，提升代码质量

## 进阶思考
基于对于以上问题的思考，我的改造方案如下:
  1. 定义工作线程和主线程的交互数据格式
  
```Typescript:line-numbers
// type.ts
export interface RpcRequest {
  /** 请求Id, 由主线程生成，用于标识返回数据属于那一次的调用 */
  requestId: number;
  /** 调用的函数名称 */
  name: string;
  /** 调用函数时的参数 */
  args: any[];
}

export interface RpcResponse {
  /** 调用的函数名称 */
  name: string;
  /** 请求Id */
  requestId: number;
  /** 函数的返回值  */
  data: any;
  /** 是否执行失败 */
  failed?: boolean;
}

export type AwaitAble<T> = T | Promise<T>;
type Fn = (...args: any[]) => any;
export type Arguments<F extends Fn> = F extends (...args: infer R) => any
  ? R
  : [];

type Method = Record<string, (...args: any[]) => AwaitAble<any>>
export const READY_REQUEST_ID = -1;
export type ServerMethods<T extends Method = Method> = T;
```
  2. 统一封装主线程与工作线程的交互，业务代码只需要对外暴露出那些函数可以执行即可，首先在工作线程内，统一通过 `WorkerServices` 类来对外交互，监听 `message` 事件和定义如何与主线程交互的方法 `sendRemote`, 这里我们限制一个 `worker` 只能实例化一次 `WorkerServices` 来确保代码的健壮性。
```Typescript:line-numbers
// server.ts
import type { RpcRequest, RpcResponse } from "./type";

type ServerMethods = {
  [k: string]: (...args: unknown[]) => unknown | Promise<unknown>
}
const READY_REQUEST_ID = -1;
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
      requestId: READY_REQUEST_ID,
      data: null,
    });
  }
}
```
  3. 然后，我们定义如何在主线程中使用 `Worker` ，通过 `WorkerClient` 类，允许我们调用工作线程的方法，并通过互相传递唯一ID加上返回Promise的形式，解决了原始调用的割裂感
```Typescript:line-numbers
// client.ts
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
    self.postMessage(data, { transfer });
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
```
### 进阶示例
通过在 `worker-type.ts` 内定义工作线程需要提供的方法，然后在主线程使用同样的类型定义， `Typescript` 就会为我们做好类型校验。
<demo
  vue="./worker/demo2/index.vue" :vueFiles="[
    './worker/demo2/index.vue',
    './worker/demo2/worker/index.ts',
    './worker/demo2/worker/worker-type.ts',
    './worker/demo2/worker/utils/client.ts',
    './worker/demo2/worker/utils/lock.ts',
    './worker/demo2/worker/utils/server.ts',
    './worker/demo2/worker/utils/type.ts',
  ]"
  react="./worker/demo2/react-demo.tsx" :reactFiles="[
    './worker/demo2/react-demo.tsx',
    './worker/demo2/worker/index.ts',
    './worker/demo2/worker/worker-type.ts',
    './worker/demo2/worker/utils/client.ts',
    './worker/demo2/worker/utils/lock.ts',
    './worker/demo2/worker/utils/server.ts',
    './worker/demo2/worker/utils/type.ts',
  ]"
 />
 
## 更进一步
  - transfer 可转移对象
  > 一个包含要转让所有权的可转移对象的可选的数组。这些对象的所有权将转移到接收方，发送方将不能再使用它们。这些可转移对象应附加到消息中；否则它们将被转移，但实际上在接收方无法访问。
  >> [来自mdn的介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/MessagePort/postMessage#transfer)  
  
当工作线程需要向主线程传递大量数据或者 `OffscreenCanvas` 时，将整个对象一起转移到主线程就会使用到这个参数，现在我们兼容一下，这里我们定义一个 `TransferRes` 类来表示返回的数据中带有可转移对象

```Typescript:line-numbers
// transfer-res.ts
const transferKey = Symbol("transferKey");

class TransferRes<T = unknown> {
  [transferKey] = true;
  constructor(public data: T, public transfer: Transferable[]) { }
}

export const isTransferRes = (val: unknown): val is TransferRes => {
  return Boolean(val && (val as any)[transferKey]);
}

export const createTransferRes = <T = unknown>(data: T, transfer: Transferable[]) => {
  return new TransferRes(data, transfer);
}
```

<<< ./worker/demo3/worker/utils/server.ts#snippet{1,43-63 Typescript:line-numbers}
  - work-pool 线程池
  > 通常一件事情一个工作线程是足够了的，如果任务量特别的大，那么线程池会是一个好的解决办法  
  
  如下所示，我们有四个任务（使用 `OffscreenCanvas` 画一个圆）需要完成，如果使用大小为3的线程池，那么我们就能同时并行3个任务，试试点击刷新按钮观察

<demo
  react="./worker/demo3/react-demo.tsx" :reactFiles="[
    './worker/demo3/react-demo.tsx',
    './worker/demo3/worker/index.ts',
    './worker/demo3/worker/worker-type.ts',
  ]"
  vue="./worker/demo3/vue-demo.vue" :vueFiles="[
    './worker/demo3/vue-demo.vue',
    './worker/demo3/worker/index.ts',
    './worker/demo3/worker/worker-type.ts',
    './worker/demo3/util.ts',
  ]"
 />