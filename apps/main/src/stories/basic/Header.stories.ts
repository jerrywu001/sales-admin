import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { fn } from 'storybook/test';

import MyHeader from './Header.vue';

const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Basic基础/Header',
  component: MyHeader,
  render: (args: any) => ({
    components: { MyHeader },
    setup() {
      return { args };
    },
    template: '<my-header :user="args.user" />',
  }),
  parameters: { layout: 'fullscreen' },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = { args: { user: { name: 'Jane Doe' } } };

export const LoggedOut: Story = { args: { user: null } };
