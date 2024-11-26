import { WorkerServices } from "./utils/server";
import { Fns } from "./worker-type";

const sleep = (time = 1000) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });

export default new WorkerServices<Fns>({
  async multiplication(val1, val2) {
    await sleep(16);
    const val = Number(val1) * Number(val2);
    const res = `Worker Result: ${Number.isNaN(val) ? "Please write two numbers" : val}`;
    return res;
  },
  
  async add(val1, val2) {
    await sleep(16);
    const val = Number(val1) + Number(val2);
    const res = `Worker Result: ${Number.isNaN(val) ? "Please write two numbers" : val}`;
    return res;
  },
});
