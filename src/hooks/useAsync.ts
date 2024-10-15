import { Pager } from "@/request";
import { ref, shallowRef, Ref, ShallowRef, UnwrapRef } from "vue";

export const defaultGetter = (val?: any) => val;
type Getter<T, R> = (val?: T) => R;
type Awaitable<T> = T | Promise<T>;

type IsShallow<T extends boolean, R> = T extends false ? Ref<R> : ShallowRef<R>;

type AsyncResponse<A extends unknown[], R, S extends boolean> = {
  data: IsShallow<S, R>;
  load: (...args: A) => Promise<false | R>;
  loading: Ref<boolean>;
  isError: Ref<boolean>;
};

export function useAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  getter?: Getter<T, R>
): AsyncResponse<A, R, S>;
export function useAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  cfg?: {
    getter?: Getter<T, R>;
    waitloading?: boolean;
    shallow?: S;
  }
): AsyncResponse<A, R, S>;
export function useAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  getter?: Getter<T, R>,
  cfg?: {
    waitloading?: boolean;
    shallow?: S;
  }
): AsyncResponse<A, R, S>;
export function useAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  getterFn?:
    | Getter<T, R>
    | {
        getter?: Getter<T, R>;
        waitloading?: boolean;
        shallow?: S;
      },
  cfg: {
    waitloading?: boolean;
    shallow?: S;
  } = {}
) {
  let config: {
    getter?: Getter<T, R>;
    waitloading?: boolean;
    shallow?: S;
  };

  if (!getterFn) {
    config = cfg || {};
  } else if (typeof getterFn === "function") {
    config = {
      ...cfg,
      getter: getterFn,
    };
  } else {
    config = getterFn;
  }

  const { waitloading = false, shallow = false } = config;
  const getter = (config.getter || defaultGetter) as Getter<T, R>;

  const data = (shallow ? shallowRef : ref)(getter()) as IsShallow<S, R>;

  const loading = ref(false);
  const isError = ref(false);
  let runner: Awaitable<T> | null = null;
  const load = async function (...arg: A) {
    if (loading.value) {
      if (waitloading && runner) {
        const res = await runner;
        return getter(res);
      }
      return false;
    }

    loading.value = true;
    try {
      runner = asyncFn(...arg);
      const res = await runner;
      const val = getter(res);
      data.value = val;
      isError.value = false;
      return val;
    } catch (err) {
      console.log("run async function errr", err);
      isError.value = true;
    } finally {
      runner = null;
      loading.value = false;
    }
    return false;
  };

  return {
    data,
    load,
    loading,
    isError,
  };
}

type ID = string | number;
export const useMultAsync = <R>(fn: (id: ID) => Awaitable<R>) => {
  const doingTask = ref<ID[]>([]);
  const load = async (id: ID) => {
    if (doingTask.value.includes(id)) {
      return;
    }
    doingTask.value.push(id);
    try {
      await fn(id);
      doingTask.value = doingTask.value.filter((i) => i !== id);
    } catch (err) {
      console.log("run async function errr", err);
    }
  };
  return {
    load,
    doingTask,
  };
};

type LastAsyncResponse<A extends unknown[], R, S extends boolean> = {
  data: IsShallow<S, R>;
  load: (...args: A) => Promise<false | R>;
  clearData: () => void;
  loading: Ref<boolean>;
  isError: Ref<boolean>;
  firstloaded: Ref<boolean>;
};

export function useLastAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  getter?: Getter<T, R>
): LastAsyncResponse<A, R, S>;
export function useLastAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  cfg?: {
    getter?: Getter<T, R>;
    shallow?: boolean;
  }
): LastAsyncResponse<A, R, S>;
export function useLastAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  getter?: Getter<T, R>,
  cfg?: {
    shallow?: boolean;
  }
): LastAsyncResponse<A, R, S>;
export function useLastAsync<
  T,
  A extends unknown[],
  R = T | undefined,
  S extends boolean = false,
>(
  asyncFn: (...args: A) => Awaitable<T>,
  getterFn?:
    | Getter<T, R>
    | {
        getter?: Getter<T, R>;
        shallow?: boolean;
      },
  cfg: {
    shallow?: boolean;
  } = {}
) {
  let config: {
    getter?: Getter<T, R>;
    shallow?: boolean;
  };

  if (!getterFn) {
    config = cfg || {};
  } else if (typeof getterFn === "function") {
    config = {
      ...cfg,
      getter: getterFn,
    };
  } else {
    config = getterFn;
  }

  const { shallow = false } = config;
  const getter = (config.getter || defaultGetter) as Getter<T, R>;
  const data = (shallow ? shallowRef : ref)(getter()) as IsShallow<S, R>;
  const loading = ref(false);
  const isError = ref(false);
  const firstloaded = ref(false);
  let id = 0;

  const load = async (...arg: A) => {
    loading.value = true;
    const selfId = ++id;
    try {
      const res = await asyncFn(...arg);
      if (id === selfId) {
        const val = getter(res);
        data.value = val;
        isError.value = false;
        firstloaded.value = true;
        return val;
      }
    } catch (err) {
      console.log("run async function errr", err);
      isError.value = true;
    } finally {
      if (id === selfId) {
        loading.value = false;
      }
    }
    return false;
  };

  const clearData = () => {
    id += 0;
    data.value = getter();
  };

  return {
    data,
    load,
    clearData,
    loading,
    isError,
    firstloaded,
  };
}

export const debounce = <A extends unknown[], R, T>(
  fn: (this: T, ...args: A) => R,
  time = 300
) => {
  let timer: any;
  return function (this: T, ...args: A) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, time);
  };
};

export const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

export const createAutocompleteFetchSuggestion = <
  T extends Record<string, any>,
  R extends Record<string, any>[],
>(
  fn: (str: string) => Awaitable<T>,
  getter?: (data: T) => R
) => {
  let id = 0;
  getter = getter || defaultGetter;
  return (str: string, cb: (data: Record<string, any>[]) => void) => {
    const sid = ++id;
    Promise.resolve(fn(str.trim()))
      .then((res) => {
        if (sid !== id) {
          return [];
        }
        const data = getter(res);
        cb(data);
      })
      .catch(() => {
        if (sid !== id) {
          return [];
        }
        cb([]);
      });
  };
};

export const useWithPageRequest = <T extends Record<string, any>>(
  asyncFn: (pager: Pager) => Awaitable<{ dataList: T[]; total: number }>,
  config?: Partial<Pager>
) => {
  const pageNum = ref(config?.pageNum ?? 1);
  let pageSize = config?.pageSize || 10;

  const loading = ref(false);
  const total = ref(0);
  const data = ref<T[]>([]);
  let hasInit = ref(false);

  const done = computed(() => {
    if (!hasInit.value) {
      return false;
    }
    return pageNum.value > Math.ceil(total.value / pageSize);
  });

  let rId = 0;

  const reset = () => {
    rId++;
    hasInit.value = false;
    pageNum.value = 1;
    total.value = 0;
    loading.value = false; // 重置加载状态以允许立即发出请求
  };

  const load = async () => {
    if (loading.value) {
      return "still loading";
    }
    loading.value = true;

    if (done.value) {
      console.log("doen");
      return "done";
    }
    const sId = rId;
    let isCurrentRequest = true;

    try {
      const lastData = pageNum.value === 1 ? [] : data.value;
      const { dataList: cData, total: cTotal } = await asyncFn({
        pageNum: pageNum.value,
        pageSize,
      });

      if (sId !== rId) {
        isCurrentRequest = false;
        return "reseted";
      }

      data.value = lastData.concat((cData || []) as UnwrapRef<T[]>);
      total.value = cTotal;
    } catch (err) {
      console.log(`load page ${pageNum} error: `, err);
    } finally {
      if (isCurrentRequest) {
        pageNum.value += 1;
        loading.value = false;
        hasInit.value = true;
      }
    }
  };

  const resetAndLoad = () => {
    reset();
    load();
  };

  return {
    loading,
    data,
    total,
    load,
    resetAndLoad,
    done,
    reset,
  };
};
