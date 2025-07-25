import { defineComponent, ref } from 'vue';
import { useTitle } from '@vueuse/core';
import demo from './demo.svg';
import styles from './Test.module.scss';
import './Demo.scss';
import './Demo.less';

export default defineComponent({
  name: 'SS',
  setup() {
    // ==== 非响应式变量 ====
    const count = ref(0);

    const increment = () => {
      count.value += 1;
    };

    // ==== hooks ====
    useTitle('increment demo');

    // ==== render ====
    return () =>
      <div class={styles.test} very cozy>
        <p
          data-testid="clicked"
          data-test="clicked"
          class="a b"
        >
          Times clicked:
          { count.value }
        </p>

        <button
          data-testid="increment"
          data-test="increment"
          onClick={increment}
        >
          increment
        </button>

        <img src={demo} alt="svg" />

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle
            cx="100"
            cy="50"
            r="40"
            stroke="black"
            stroke-width="2"
            fill="red"
          />
        </svg>
      </div>
    ;
  },
});
