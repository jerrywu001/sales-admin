// oxlint-disable no-invalid-regexp
<template>
  <beams>
    <div class="login-box">
      <div class="login-title">
        <div>
          <img :src="loginLogo" alt="logo" class="w-[30px] h-[30px]">
        </div>
        <div>二手交易合规运营平台</div>
      </div>

      <div class="login-tabs">
        <div
          class="tab-item"
          :class="{ active: enableSmsLogin }"
          @click="onTabsChange(true)"
        >
          验证码登录
        </div>
        <div
          class="tab-item"
          :class="{ active: !enableSmsLogin }"
          @click="onTabsChange(false)"
        >
          密码登录
        </div>
      </div>

      <div
        class="custom-input-wrapper mt-[24px]"
        :class="{ 'custom-field-error': errors.username }"
      >
        <svg-icon icon="lucide:user-round" />
        <input
          type="text"
          :value="formState.username"
          placeholder="请输入登陆手机号"
          maxlength="11"
          @change="onPhoneChange"
          @keyup.enter="doLogin"
        >
        <span class="custom-field-error-span">{{ errors.username }}</span>
      </div>

      <div
        v-if="!enableSmsLogin"
        class="custom-input-wrapper"
        :class="{ 'custom-field-error': errors.password }"
      >
        <svg-icon icon="mdi:password-outline" />
        <input
          :type="`${showpass ? 'text' : 'password'}`"
          placeholder="请输入密码"
          @change="onPasswordChange"
          @keyup.enter="doLogin"
        >
        <svg-icon
          class="absolute cursor-pointer top-[11px] right-[6px]"
          :icon="`${showpass ? 'majesticons:eye-line' : 'pajamas:eye-slash'}`"
          @click="showpass = !showpass"
        />
        <span class="custom-field-error-span">{{ errors.password }}</span>
      </div>
      <div
        v-else
        class="relative flex justify-between"
      >
        <div
          class="custom-input-wrapper !w-[250px]"
          :class="{ 'custom-field-error': errors.code }"
        >
          <svg-icon icon="lucide:shield-check" />
          <input
            type="text"
            :value="formState.code"
            placeholder="请输入验证码"
            @change="onSmscodeChange"
            @keyup.enter="doLogin"
          >
          <span class="custom-field-error-span">{{ errors.code }}</span>
        </div>

        <sms-button
          ref="smsBtnRef"
          @click="sendSms"
        />
      </div>

      <a-button
        class="login-submit select-none"
        type="primary"
        :loading="logining"
        @click="doLogin"
      >
        登录
      </a-button>

      <div class="login-service">
        <span
          class="cursor-pointer flex items-center"
          @click="checkedService = !checkedService"
        >
          <a-checkbox
            class="mr-2"
            :model-value="checkedService"
          />
          <label class="cursor-pointer">已同意</label>
          <a
            class="text-[var(--color-primary)] text-[14px] hover:underline"
            @click="(e) => openService('agreement', e)"
          >《xxx平台协议》</a>及
          <a
            class="text-[var(--color-primary)] text-[14px] hover:underline"
            @click="(e) => openService('secretPolicy', e)"
          >《隐私协议》</a>
        </span>
      </div>
    </div>
  </beams>
</template>

<script setup lang="ts">
import Logo from '@/assets/imgs/logo.png';
import Beams from '@/layout/Beams.vue';
import { GlobalTitle } from '@core/main';
import { SmsButton, SvgIcon, onConfirm } from '@vue3/components';
import { useTitle } from '@vueuse/core';
import { ESmsType, type IUserParam, loginToServer, sendNotLoginSmscode } from '@core/api';
import { computed, h, reactive, ref } from 'vue';
import { checkPass, checkPhone, checkSmsCode, parseQueryString } from '@core/tools';
import { Message } from '@arco-design/web-vue';

useTitle(`登录-${GlobalTitle}`);

let sendSmsLock = false;

const formState = reactive<IUserParam>({
  username: '',
  password: '',
  code: '',
  loginMethod: 0,
});

const errors = reactive({
  username: '',
  password: '',
  code: '',
});

const showpass = ref(false);
const logining = ref(false);
const isSMSMode = ref(true);
const checkedService = ref(false);

const loginLogo = ref(Logo);
const smsBtnRef = ref<InstanceType<typeof SmsButton>>(null);

const enableSmsLogin = computed(() => formState.loginMethod === 0);

async function sendSms() {
  if (sendSmsLock) return;

  const phoneErr = checkPhone(formState.username, '登录');

  if (phoneErr) return Message.error(phoneErr);

  try {
    sendSmsLock = true;
    smsBtnRef.value?.showLoading();
    await sendNotLoginSmscode(ESmsType.Login, formState.username);

    smsBtnRef.value?.countdown();
  } catch (error) {
    smsBtnRef.value?.hideLoading();
    if ((error as Error).message) Message.error((error as Error).message);
  }

  setTimeout(() => {
    sendSmsLock = false;
  }, 1300);
}
function doLogin() {
  if (logining.value) return;

  if (!formState.username) return Message.error('请输入手机号');
  if (errors.username) return;

  if (enableSmsLogin.value && !formState.code) return Message.error('请输入短信验证码');
  if (enableSmsLogin.value && errors.code) return;

  if (!enableSmsLogin.value && !formState.password) return Message.error('请输入密码');
  if (!enableSmsLogin.value && errors.password) return;

  if (!checkedService.value) {
    onConfirm({
      title: '协议',
      message: h(
        'div',
        { class: 'text-[14px] text-[#fff]' },
        [
          h('span', '同意'),
          h(
            'a',
            {
              class: 'text-[#E4C8A1] hover:underline',
              href: '#',
              target: '_blank',
              onClick: (e) => openService('agreement', e),
            },
            '《用户协议》',
          ),
          h('span', '和'),
          h(
            'a',
            {
              class: 'text-[#E4C8A1] hover:underline',
              href: '#',
              target: '_blank',
              onClick: (e) => openService('secretPolicy', e),
            },
            '《隐私协议》',
          ),
        ],
      ),
      onOk: async () => {
        checkedService.value = true;
        await continueLogin();
      },
    });
    return;
  }

  continueLogin();
}

async function fetchBrandInfo() {
  // TODO
  const { client_id = '' } = getQueryData();

  await console.log('client_id', client_id);
}

async function continueLogin() {
  logining.value = true;

  try {
    const { state, redirectUrl } = getQueryData();
    const { code = '' } = await loginToServer(formState);

    if (redirectUrl) {
      const confirRedirectUrl = redirectUrl.includes('?') ? redirectUrl : `${redirectUrl}?`;

      location.href = `${confirRedirectUrl}&code=${code}&state=${state}`;
    }
  } catch (error) {
    const err = error as Error;

    if (err.message) Message.error(err.message);
  }

  setTimeout(() => {
    logining.value = false;
  }, 500);
}

function onTabsChange(smsMode: boolean) {
  if (formState.loginMethod === Number(!smsMode)) return;

  if (smsMode) {
    formState.code = '';
  } else {
    formState.password = '';
  }

  errors.code = '';
  errors.password = '';
  errors.username = '';

  isSMSMode.value = smsMode;
  formState.loginMethod = smsMode ? 0 : 1;
}

function onPhoneChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const err = checkPhone(target.value, '登录');

  errors.username = err;
  formState.username = target.value;
}

function onSmscodeChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const err = checkSmsCode(target.value);

  errors.code = err;
  formState.code = target.value;
}

function onPasswordChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const err = checkPass(target.value);

  errors.password = err;
  formState.password = target.value;
}

function getProtocol(key = 'agreement' as 'agreement' | 'secretPolicy') {
  let file = '';
  const defaultFileUrl = {
    agreement: 'https://lg-test.upfreework.com/file/2/fca64fe8550a4eed827dd00aeb0d98f0/【定稿】宁伙伴分账通用户服务协议V1.0.docx',
    secretPolicy: 'https://lg-test.upfreework.com/file/2/7546770478cf4d5c9c57c31a0c0ddff7/【定稿】隐私协议V1.0.docx',
  };

  file = defaultFileUrl[key];

  return file;
}

function openService(key = 'agreement' as 'agreement' | 'secretPolicy', e: MouseEvent) {
  e.stopPropagation();

  window.open(`/office-previewer?url=${getProtocol(key)}`);
}

function getQueryData() {
  const querString = location.href.split('&redirect_uri=')[0];
  const redirectUrl = location.href.split('&redirect_uri=')[1];
  const query = parseQueryString<{
    client_id: string;
    state: string;
  }>(`?${querString.split('?')[1]}`);

  const { client_id = '', state = '' } = query;

  return {
    client_id: client_id || '',
    state: state || '',
    redirectUrl: redirectUrl || '',
  };
}

fetchBrandInfo();
</script>

<style lang="scss">
.arco-checkbox {
  padding-left: 0;
}

.login-service {
  .arco-checkbox-icon {
    border: none !important;
    background-color: #fff;
  }

  .arco-checkbox-checked .arco-checkbox-icon {
    background-color: #E4C8A1;
  }
}

.message-box-footer {
  .arco-btn-primary {
    background-color: #E4C8A1 !important;
    color: #000 !important;

    &:hover {
      opacity: .7;
    }
  }
}
</style>

<style scoped lang="scss" src="./index.scss" />
