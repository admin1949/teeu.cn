import { Response, request } from "@/request";

interface FileVO {
  id: number;
  size: number;
  fileName: string;
  extension: string;
  sortPath: string;
  createTime: Date;
}

export interface BlogVO {
  avatar: FileVO;
  pics: FileVO[];
  id: number;
  sort: number;
  link: string | null;
  title: string;
  tags: string;
  skillTags: string;
  desc: string;
  visible: boolean;
}

export const queryBlogList = (
  data: {
    content?: string;
    ignoreVisible?: boolean;
  } = {}
) => {
  return request<Response<BlogVO[]>>({
    url: "/blog/list-all",
    method: "POST",
    data,
  });
};
