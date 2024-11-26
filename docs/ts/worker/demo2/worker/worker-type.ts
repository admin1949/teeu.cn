import type { AwaitAble, ServerMethods } from "./utils/type";

export type Fns = ServerMethods<{
  multiplication: (val1: string, val2: string) => AwaitAble<string>;
  add: (val1: string, val2: string) => AwaitAble<string>;
}>