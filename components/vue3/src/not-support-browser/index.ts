import { getExplorer } from '@core/tools';
import { onBeforeMount, ref } from 'vue';

export function useCheckBrowser() {
  const error = ref('');

  function checkBroswer() {
    const { type, v } = getExplorer();

    if (!['firefox', 'chrome', 'edge'].includes(type)) {
      error.value = '暂不支持该浏览器，请使用chrome、firefox或edge浏览器访问';
      return false;
    }

    const version = Number.parseFloat(String(v));

    if (type === 'firefox' && version < 104) {
      error.value = '当前浏览器版本过低，请升级firefox 104以及以上版本';
      return false;
    }

    if (type === 'chrome' && version < 107) {
      error.value = '当前浏览器版本过低，请升级chrome 107以及以上版本';
      return false;
    }

    if (type === 'edge' && version < 107) {
      error.value = '当前浏览器版本过低，请升级edge 107以及以上版本';
      return false;
    }

    return true;
  }

  onBeforeMount(() => {
    checkBroswer();
  });

  return error;
}

export { default as NotSupportBrowser } from './NotSupportBrowser.vue';
