import { request, Response } from "@/request";

export interface Dic {
  parentCode: string | null;
  id: number;
  code: string;
  name: string;
  sort: number;
  visible: boolean;
  desc?: string;
}

export const queryDictAll = (data: {
  code: string;
  agreeVisible?: boolean;
  name?: string;
}) => {
  return request<Response<Dic>>({
    url: "/dict/list-all",
    method: "POST",
    data,
  });
};
