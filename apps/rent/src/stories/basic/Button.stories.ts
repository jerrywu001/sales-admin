import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { fn } from 'storybook/test';
import { Button } from '@arco-design/web-vue';

// https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Basic基础/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { Button },
    template: '<Button v-bind="args">按钮</Button>',
  }),
  args: { type: 'primary' },
};

export const Primary: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { Button },
    template: '<Button v-bind="args">按钮</Button>',
  }),
  args: { type: 'primary' },
};

export const Success: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { Button },
    template: '<Button v-bind="args">按钮</Button>',
  }),
  args: { status: 'success' },
};

export const Danger: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { Button },
    template: '<Button v-bind="args">按钮</Button>',
  }),
  args: { status: 'danger' },
};
