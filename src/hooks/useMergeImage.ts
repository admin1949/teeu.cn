import { useTemplateRef, onWatcherCleanup, watchPostEffect } from "vue";

export const useMergeFile = () => {
  const inputRef = useTemplateRef<HTMLInputElement>("xxx");

  watchPostEffect(() => {
    const input = inputRef.value;
    if (!input) {
      return;
    }

    async function onchange() {
      const files = [...(input?.files || [])];
      if (!files.length) {
        return;
      }
      const imgs = await Promise.all(
        files.map(async (file) => {
          const url = await getImageFileUrl(file);
          return createImage(url);
        })
      );
      const canvas = mergeImage(imgs);
      if (canvas) {
        await downloadCanvasImage(canvas);
      }
    }

    input.addEventListener("change", onchange);
    onWatcherCleanup(() => {
      input.removeEventListener("change", onchange);
    });
  });
};

const getImageFileUrl = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = reject;
  });
};

const createImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
};

const mergeImage = (imgs: HTMLImageElement[]) => {
  let width = 0;
  let height = 0;
  imgs.forEach((img) => {
    width += img.naturalWidth;
    height = Math.max(height, img.naturalHeight);
  });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  let startX = 0;
  imgs.forEach((img) => {
    ctx.drawImage(img, startX, (height - img.naturalHeight) / 2);
    startX += img.naturalWidth;
  });

  return canvas;
};

const downloadCanvasImage = (canvas: HTMLCanvasElement) => {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject();
          return;
        }
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = "xxx.webp";
        a.click();
        URL.revokeObjectURL(href);
        resolve();
      },
      "image/webp",
      1
    );
  });
};
