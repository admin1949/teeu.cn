import { ref, onScopeDispose } from "vue";

export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`
}
interface Size {
  width: number,
  height: number,
}

const updatePixelRatio = (size: Size): Size => {
  return {
    width: Math.floor(size.width * self.devicePixelRatio),
    height: Math.floor(size.height * self.devicePixelRatio),
  };
};

export const useCanvasSize = (originSize: Size) => {
  const size = ref(updatePixelRatio(originSize));

  const update = () => {
    size.value = updatePixelRatio(originSize);
  }
  
  let mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
  const matcher = matchMedia(mqString);
  matcher.addEventListener("change", update);

  onScopeDispose(() => {
    matcher.removeEventListener("change", update);
  })

  return {
    size,
  }
}
