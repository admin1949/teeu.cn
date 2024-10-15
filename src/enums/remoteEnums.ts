/* eslint-disable camelcase */
export enum REMOTE_ENUMS {
  /** 启用状态 */
  TYPE_TAG = "type-tag",
  SKILL_TAG = "skill-tag",
}

export type { Dic } from "@/api/dic";

export interface DictItem {
  /** 字典值 */
  code: string;
  /** 字典中文名称 */
  name: string;
}
