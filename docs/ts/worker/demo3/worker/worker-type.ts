import type { AwaitAble, ServerMethods } from "./utils/type";
import type { TransferRes } from "./utils/transfer-res"

export type Fns = ServerMethods<{
  draw: (width: number, height: number, color: string, scale?: number) => AwaitAble<TransferRes<ImageBitmap>>;
}>