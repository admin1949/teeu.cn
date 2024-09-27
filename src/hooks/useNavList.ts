import {
  MaybeRef,
  ref,
  unref,
  useTemplateRef,
  onMounted,
  watch,
  computed,
} from "vue";
import { useResizeObserver } from "@vueuse/core";

const DEAFULT_SIZE = () => ({
  width: "0",
  height: "0",
  left: "0",
  top: "0",
});

export const useNavList = <T>(achorList: MaybeRef<T[] | readonly T[]>) => {
  const activeIndex = ref(0);
  const navContainer = useTemplateRef<HTMLElement>("nav-list");
  const size = ref({
    width: "0",
    height: "0",
    left: "0",
    top: "0",
  });
  const sizeStyle = computed(() => {
    const { width, height, left, top } = size.value;
    return `--width: ${width}; --height: ${height}; --left:${left}; --top: ${top}`;
  });

  const updateSize = () => {
    const parent = navContainer.value;
    if (!parent) {
      size.value = DEAFULT_SIZE();
      return;
    }

    const child = parent.children[activeIndex.value] as HTMLElement;
    if (!child) {
      size.value = DEAFULT_SIZE();
      return;
    }

    const { offsetTop, offsetLeft, clientWidth, clientHeight } = child;

    size.value = {
      top: offsetTop + "px",
      left: offsetLeft + "px",
      width: clientWidth + "px",
      height: clientHeight + "px",
    };
  };

  onMounted(updateSize);
  watch(activeIndex, updateSize);
  useResizeObserver(navContainer, updateSize);

  const handleActiveIdx = (idx: number) => {
    const item = unref(achorList)[idx];
    if (!item) {
      return;
    }
    activeIndex.value = idx;
  };

  return {
    handleActiveIdx,
    activeIndex,
    size,
    sizeStyle,
  };
};
