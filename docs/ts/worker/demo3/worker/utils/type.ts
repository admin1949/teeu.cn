import { TransferRes } from "./transfer-res";

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
export type Returned<F extends Fn> = F extends (...args: any[]) => AwaitAble<TransferRes<infer R>> ? R : ReturnType<F>;

type Method = Record<string, (...args: any[]) => AwaitAble<any>>
export const READY_REQUEST_ID = -1;
export type ServerMethods<T extends Method = Method> = T;