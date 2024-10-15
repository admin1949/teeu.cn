export const buildFilePath = (file: string | { sortPath: string }) => {
  if (typeof file !== "string") {
    return "/files/" + file.sortPath;
  }
  return "/files/" + file;
};
