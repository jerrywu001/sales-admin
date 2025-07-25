import { IPageParam } from './common';

export interface ITestTableParam extends IPageParam {
  /** 通道id */
  channelType?: number;
  /** 收款用户 */
  name?: string;
  /** 用户ID */
  payeeNo?: string;
  /** 用户类型 */
  payeeType?: number;
  /** 用户状态 */
  status?: string;
  /** 创建时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 失败原因 */
  failReason?: string;
}

export interface IPayeeItem {
  id: string;
  /** 收款方编号 */
  payeeNo: string;
  /** 收款方名称 */
  name: string;
  /** 通道类型 */
  channelType: number;
  /** 收款方类型 */
  payeeType: number;
  /** 收款状态 */
  status: EPayeeStatus;
  /** 创建时间 */
  createTime: string;
  /** 失败原因 */
  failReason?: string;
}

export enum EPayeeStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  FAIL = 'FAIL',
  CHECK = 'CHECK',
  CANCELLED = 'CANCELLED',
}

export const PayeeStatusLabel = {
  [EPayeeStatus.ENABLED]: '已启用',
  [EPayeeStatus.DISABLED]: '已禁用',
  [EPayeeStatus.PENDING]: '待审核',
  [EPayeeStatus.FAIL]: '审核失败',
  [EPayeeStatus.CHECK]: '审核中',
  [EPayeeStatus.CANCELLED]: '已取消',
};

export const PayeeStatusColor = {
  [EPayeeStatus.ENABLED]: 'success',
  [EPayeeStatus.DISABLED]: 'info',
  [EPayeeStatus.PENDING]: 'primary',
  [EPayeeStatus.FAIL]: 'danger',
  [EPayeeStatus.CHECK]: 'warning',
  [EPayeeStatus.CANCELLED]: 'info',
};
