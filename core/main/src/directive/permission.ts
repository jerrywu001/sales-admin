import { useUserStore } from '../..';

export default {
  mounted(el: any, binding: any) {
    const { value: permissionFlag } = binding;
    const all_permission = '*:*:*';
    const { state: { permissions } } = useUserStore();

    if (permissionFlag && permissionFlag instanceof Array && permissionFlag.length > 0) {
      const hasPermissions = permissions.some((permission) => all_permission === permission || permissionFlag.includes(permission));

      if (!hasPermissions && el && el.parentNode && !(__MOCK_PROD__ || __ENABLE_DEV_MOCK__)) {
        el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('请设置操作权限标签值');
    }
  },
};
