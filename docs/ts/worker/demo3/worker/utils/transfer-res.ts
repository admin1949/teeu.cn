const transferKey = Symbol("transferKey");

export class TransferRes<T = unknown> {
  [transferKey] = true;
  constructor(public data: T, public transfer: Transferable[]) { }
}

export const isTransferRes = (val: unknown): val is TransferRes => {
  return Boolean(val && (val as any)[transferKey]);
}

export const createTransferRes = <T = unknown>(data: T, transfer: Transferable[]) => {
  return new TransferRes(data, transfer);
}