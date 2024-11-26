export interface RpcResponse {
  name: string;
  requestId: number;
  data: any;
  failed?: boolean;
}

export interface RpcRequest {
  requestId: number;
  name: string;
  args: any[];
}

export type AwaitAble<T> = T | Promise<T>;
type Fn = (...args: any[]) => any;
export type PerformanceResult<T = any> = [T, Transferable[]];
export type SyncPerformanceResult<T = any> = Promise<[T, Transferable[]]>;
export type Arguments<F extends Fn> = F extends (...args: infer R) => any
  ? R
  : [];
export type ReturnTypePerformanceResult<F extends Fn> = F extends (
  ...args: any[]
) => AwaitAble<PerformanceResult<infer R>>
  ? R
  : void;

interface CFn {
  (...args: any[]): AwaitAble<any>;
}
interface CpFn {
  (...args: any): AwaitAble<PerformanceResult<any>>;
}
export interface ServerMethods<
  T extends Record<string, CFn> = Record<string, CFn>,
  K extends Record<string, CpFn> = Record<string, CpFn>
> {
  fns: T;
  pfns: K;
}
