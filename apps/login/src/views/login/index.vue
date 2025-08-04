<template>
  <div class="login">
    <div
      class="login-form"
      :style="`background-image: url('${coverBg}')`"
    >
      <div class="w-[600px] flex-1" />

      <div class="login-content flex-1">
        <!-- logo -->
        <div
          class="login-logo"
          :style="`background-image: url('${loginLogo}')`"
        />

        <!-- login form area -->
        <div class="login-box">
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

          <a-button
            class="login-submit select-none"
            type="primary"
            :loading="logining"
            @click="doLogin"
          >
            登录
          </a-button>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="ts">
import { GlobalTitle } from '@core/main';
import { SvgIcon, Footer } from '@vue3/components';
import { useTitle } from '@vueuse/core';
import { ESystemType, type IUserParam, getSysTypeValue, getToken, loginToServer, removeToken, setToken, updateSysType } from '@core/api';
import { onBeforeMount, reactive, ref } from 'vue';
import { checkPass, checkPhone, isNull } from '@core/tools';
import { Message } from '@arco-design/web-vue';

useTitle(`登录-${GlobalTitle}`);

const formState = reactive<IUserParam>({
  username: '',
  password: '',
});

const errors = reactive({
  username: '',
  password: '',
  code: '',
});

const coverBg = ref('');
const loginLogo = ref('');
const showpass = ref(false);
const logining = ref(false);

async function doLogin() {
  if (logining.value) return;

  if (!formState.username) return Message.error('请输入手机号');
  if (errors.username) return;

  if (!formState.password) return Message.error('请输入密码');
  if (errors.password) return;

  try {
    logining.value = true;
    const { token, systemType } = await loginToServer(formState);

    updateSysType(!isNull(systemType) ? String(systemType) : String(ESystemType.SAAS));

    setToken(token);
    checkIdentity();
  } catch (error) {
    const err = error as Error;

    if (err.message) Message.error(err.message);
  }

  setTimeout(() => {
    logining.value = false;
  }, 500);
}

/**
 * 登录后判断身份跳转端口
 */
function checkIdentity() {
  const ports = {
    // 主应用端口
    [ESystemType.SAAS]: __MAIN_APP_PORT__,
    // 租赁端口
    [ESystemType.RENT]: __RENT_APP_PORT__,
  };

  const prefixs = {
    //
    [ESystemType.SAAS]: 'identity-saas',
    // 租赁
    [ESystemType.RENT]: 'identity-rent',
  };

  const systemTypeStr = getSysTypeValue();
  const systemType = isNull(systemTypeStr) ? undefined : Number(systemTypeStr);

  if (systemType === undefined) {
    Message.error('获取身份失败');

    removeToken();
    return;
  }

  try {
    if (__ENV_DEV__) {
      window.location.href = `${location.protocol}//${location.hostname}:${ports[systemType]}/${prefixs[systemType!]}`;
    } else {
      window.location.href = `/${prefixs[systemType!]}`;
    }
  } catch (error) {
    Message.error((error as Error).message);
  }
}

function onPhoneChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const err = checkPhone(target.value, '登录');

  errors.username = err;
  formState.username = target.value;
}

function onPasswordChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const err = checkPass(target.value);

  errors.password = err;
  formState.password = target.value;
}

onBeforeMount(() => {
  if (getToken()) checkIdentity();
});

</script>

<style scoped lang="scss" src="./index.scss" />
