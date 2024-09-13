<script lang="tsx">
import TypedJs from "typed.js";
import {
  useTemplateRef,
  onMounted,
  onUnmounted,
  h,
  defineComponent,
} from "vue";

export default defineComponent<{
  tag?: string;
  strings: string[];
  typeSpeed?: number;
}>(
  (props, { slots }) => {
    const container = useTemplateRef<HTMLElement>("container");
    let instance: TypedJs | null = null;
    onMounted(() => {
      const c = container.value;
      if (!c) {
        return;
      }

      instance = new TypedJs(c, {
        strings: props.strings,
        typeSpeed: props.typeSpeed ?? 50,
        loop: true,
      });

      instance;
    });

    onUnmounted(() => {
      if (instance) {
        instance.destroy();
        instance = null;
      }
    });

    return () => {
      const tag = props.tag || "div";
      return h("div", [
        slots.default?.(),
        h(tag, {
          ref: "container",
        }),
      ]);
    };
  },
  {
    props: ["tag", "strings", "typeSpeed"],
  }
);
</script>

<style scoped></style>
