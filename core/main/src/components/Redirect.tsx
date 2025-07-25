import type { ITab } from '../..';
import { defineComponent, nextTick, reactive, toRaw } from 'vue';
import { useRouter } from 'vue-router';

export const Redirect = defineComponent({
  name: 'Redirect',
  setup() {
    const router = useRouter();

    if (tabState.data?.name) {
      router.replace({
        name: tabState.data.name,
        query: tabState.data.query || undefined,
        state: tabState.data.state ? toRaw(tabState.data.state) : undefined,
      });

      nextTick(() => {
        setTimeout(() => {
          tabState.data = {} as ITab;
          tabState.replaceIndex = -1;
        });
      });
    }

    return () => null;
  },
});

export const tabState = reactive({
  data: {} as ITab,
  replaceIndex: -1,
});
