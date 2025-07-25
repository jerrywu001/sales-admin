import { ref, VNode } from 'vue';

export interface IMessageBoxValues {
  /**
   * 标题
   * @default '提示'
   */
  title?: string;
  /** 提示内容 */
  message: string | VNode;
  /**
   * 提示类型
   * @description 对应内置图标，为空则不显示图标。可选值为`success`, `warning`, `info`, `danger`
   * @default ''
   */
  type?: '' | 'success' | 'warning' | 'info' | 'danger';
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 是否显示右上角关闭按钮 */
  showClose?: boolean;
  /** 是否可以通过点击遮罩关闭对话框 */
  closeOnClickModal?: boolean;
  /** 是否显示取消按钮 */
  showCancelButton?: boolean;
  /**
   * 确认事件
   */
  onOk?: () => Promise<void> | void;
  /**
   * 取消事件
   */
  onCancel?: () => void;
}

const defaultMessageBoxValues: IMessageBoxValues = {
  title: '提示',
  message: '',
  okText: '确认',
  cancelText: '取消',
  showClose: true,
  closeOnClickModal: false,
  showCancelButton: true,
  type: '' as '' | 'success' | 'warning' | 'info' | 'danger',
  onOk: () => {},
  onCancel: () => {},
};

export const messageBoxState = ref<IMessageBoxValues | null>(null);

export function onConfirm({
  title,
  message,
  okText,
  cancelText,
  showClose,
  closeOnClickModal,
  showCancelButton,
  type,
  onOk,
  onCancel,
}: IMessageBoxValues) {
  messageBoxState.value = {
    title: title || defaultMessageBoxValues.title,
    message: message || defaultMessageBoxValues.message,
    okText: okText || defaultMessageBoxValues.okText,
    cancelText: cancelText || defaultMessageBoxValues.cancelText,
    showClose: showClose || defaultMessageBoxValues.showClose,
    closeOnClickModal: closeOnClickModal || defaultMessageBoxValues.closeOnClickModal,
    showCancelButton: showCancelButton || defaultMessageBoxValues.showCancelButton,
    type,
    onOk,
    onCancel,
  };
}
