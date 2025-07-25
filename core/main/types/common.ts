import { TableColumnData } from '@arco-design/web-vue/es/table/interface';

export interface IPageParam {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  size: number;
}

export interface IAnyObject {
  /** 键值对 */
  [key: string]: unknown;
}

export interface IOptions {
  value: unknown;
  label: string;
}

export interface IGeneralChart {
  xAxis: string[];
  data: Array<{
    name: string;
    value: number[];
  }>;
}

export type ILayoutSizeProps = 'mini' | 'small' | 'medium' | 'large';

export type IColumn = TableColumnData & { checked?: boolean };

export const defaultPageSize = 15;
