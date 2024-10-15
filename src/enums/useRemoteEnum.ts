import { queryDictAll } from "@/api/dic";
import { REMOTE_ENUMS, Dic } from "@/enums/remoteEnums";
import { onScopeDispose, ref, shallowRef } from "vue";

export { REMOTE_ENUMS } from "@/enums/remoteEnums";

type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ObjectChange<T> = {
  [K in keyof T]: (event: K, data: T[K]) => void;
}[keyof T];

type OC<T> = {
  [K in keyof T]?: (val: T[K]) => void;
};

interface DepItem<T> {
  data: T[];
  loading: boolean;
  isFromRootCache: boolean;
}

interface CacheValue<T, I = DepItem<T>> {
  refresh: () => void;
  disconnectFromRoot: (() => void) | null;
  connect: {
    source: I;
    dispatchChnage: UnionToIntersection<ObjectChange<I>>;
    addDep: (item: OC<I>) => () => void;
  };
}

const createConnectObject = <T extends Record<string, any>>(source: T) => {
  const deps = new Set<OC<T>>();
  const dispatchChnage = (<K extends keyof T>(event: K, data: T[K]) => {
    source[event] = data;
    deps.forEach((item) => {
      item[event]?.(data);
    });
  }) as UnionToIntersection<ObjectChange<T>>;

  const addDep = (item: OC<T>) => {
    deps.add(item);
    return () => {
      deps.delete(item);
    };
  };

  return {
    dispatchChnage,
    addDep,
    source,
  };
};

class CachedDicStore {
  private cacheDic = new Map<string, CacheValue<Dic>>();

  private createCacheKey(type: REMOTE_ENUMS, parentCode: string) {
    return type + ";" + parentCode;
  }

  private getConnectObj<T>(data: T) {
    return createConnectObject({
      data,
      loading: false,
      isFromRootCache: false,
    });
  }

  private createRefresh(type: REMOTE_ENUMS, parentCode: string) {
    const key = this.createCacheKey(type, parentCode);
    return async () => {
      const cacheValue = this.cacheDic.get(key);
      if (!cacheValue) {
        throw new Error(`枚举值 ${key} 不存在!`);
      }

      if (cacheValue.connect.source.loading) {
        return false;
      }

      if (cacheValue.connect.source.isFromRootCache) {
        cacheValue.connect.dispatchChnage("isFromRootCache", false);
        cacheValue.disconnectFromRoot?.();
        cacheValue.disconnectFromRoot = null;
      }

      cacheValue.connect.dispatchChnage("loading", true);
      try {
        const { data } = await queryDictAll({
          code: type,
        });
        if (Array.isArray(data)) {
          cacheValue.connect.dispatchChnage("data", data);
        } else {
          cacheValue.connect.dispatchChnage("data", []);
        }
      } catch (err) {
        console.log(
          `get enum type: "${type}", parentCode: "${parentCode}" error `
        );
      } finally {
        cacheValue.connect.dispatchChnage("loading", false);
      }
    };
  }

  getCachedDic(type: REMOTE_ENUMS, parentCode = "") {
    const key = this.createCacheKey(type, parentCode);
    let cacheValue = this.cacheDic.get(key);
    if (cacheValue) {
      return cacheValue;
    }

    const refresh = this.createRefresh(type, parentCode);

    cacheValue = {
      refresh,
      disconnectFromRoot: null,
      connect: this.getConnectObj(new Array<Dic>()),
    };
    this.cacheDic.set(key, cacheValue);
    refresh();
    return cacheValue;
  }
}

const DIC_STORE_CACHE = new CachedDicStore();

export const useListDic = (type: REMOTE_ENUMS, parentCode = "") => {
  const item = DIC_STORE_CACHE.getCachedDic(type, parentCode);
  const loading = ref(item.connect.source.loading);
  const data = shallowRef(item.connect.source.data);
  const isFromRootCache = ref(item.connect.source.isFromRootCache);

  const off = item.connect.addDep({
    data: (val) => (data.value = val),
    loading: (val) => (loading.value = val),
    isFromRootCache: (val) => (isFromRootCache.value = val),
  });

  const t = (key: string | number, defaultValue = "-") => {
    const item = data.value.find((i) => i.code === key);
    if (!item) {
      return defaultValue;
    }
    return item.name;
  };

  onScopeDispose(() => {
    off();
  });

  return {
    data,
    loading,
    refresh: item.refresh,
    t,
  };
};
