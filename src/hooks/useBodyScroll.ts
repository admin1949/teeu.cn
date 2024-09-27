import type { ScrollbarInstance } from "element-plus";
import { MaybeRef } from "vue";

export const useBodyScroll = createGlobalState(() => {
  let instance: ScrollbarInstance | null = null;

  const setInstance = (i: MaybeRef<ScrollbarInstance> | null) => {
    instance = unref(i);
  };

  const achorList = [
    { name: "首页", query: "#home" },
    { name: "关于", query: "#about" },
    { name: "项目", query: "#project" },
    { name: "联系", query: "#me" },
  ] as const;

  let rId = 0;
  let scorllByUser = false;
  const scrollTo = (
    query: string,
    config: Omit<ScrollToOptions, "top" | "left"> = {}
  ) => {
    const el = document.querySelector<HTMLElement>(query);
    if (!el || !instance) {
      return;
    }
    const top = el.offsetTop - 20;
    instance.scrollTo({
      top,
      behavior: "smooth",
      ...config,
    });
    const sId = ++rId;
    scorllByUser = true;
    setTimeout(() => {
      if (sId === rId) {
        scorllByUser = false;
      }
    }, 1000);
  };
  const active = ref("");
  const refreshActiveArch = useThrottleFn((top: number) => {
    const list = achorList
      .map((i) => {
        return {
          target: document.querySelector<HTMLElement>(i.query),
          query: i.query,
        };
      })
      .filter((i) => i.target)
      .map((i) => ({
        top: i.target!.offsetTop,
        query: i.query,
      }))
      .sort((i, j) => i.top - j.top);
    if (!list.length || list[0].top > top) {
      active.value = list[0].query;
      return;
    }

    for (let i = 0; i < list.length; i++) {
      const isBottom = top >= list[i].top;
      const isLast = i >= list.length - 1;
      if (isLast || (isBottom && top < list[i + 1].top)) {
        active.value = list[i].query;
        return;
      }
    }
  }, 16);

  const onScroll = (opt: { scrollTop: number; scrollLeft: number }) => {
    if (scorllByUser) {
      return;
    }
    refreshActiveArch(opt.scrollTop);
  };

  return {
    setInstance,
    scrollTo,
    onScroll,
    achorList,
    active,
  };
});
