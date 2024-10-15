import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "@/const";

const server = axios.create({
  baseURL: BASE_URL,
  method: "POST",
});

// server.interceptors.response.use(async (res) => {
//   const data = res.data as Response;
//   if (data && Number(data.code) === NO_AUTH_CODE) {
//     if (!shouldRetry(res.config)) {
//       clearRetryHistory(res.config);
//       return res;
//     }
//     const status = await autoLogin();
//     if (!status) {
//       return res;
//     }
//     return server(res.config);
//   }
//   return res;
// });

export const request = async <T, OT = unknown>(opt: AxiosRequestConfig<OT>) => {
  const res = await server.request<any, AxiosResponse<T>, OT>(opt);
  return res.data;
};

export interface Response<T = unknown> {
  data: T;
  message: string;
  code: number;
}

export interface ResponseList<T = unknown> {
  data: {
    dataList: T[];
    total: number;
  };
  code: number;
  message: number;
}

export interface Pager {
  pageNum: number;
  pageSize: number;
}
