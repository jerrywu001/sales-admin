<template>
  <div class="container">
    <div style="display: flex;">
      <div class="error">
        <h1>error</h1>
        <p>{{ error }};)</p>
      </div>
      <cards />
    </div>

    <a-divider />

    <div style="font-size: 18px; font-weight: 600; padding-bottom: 8px;">
      下载地址
    </div>

    <div class="broswers">
      <div>
        <svg-icon icon="logos:chrome" />
        <a href="https://chrome.clang.cn/" target="_blank">Chrome mac/win 最新(v120+) 离线安装包</a>
      </div>
      <div>
        <svg-icon icon="logos:firefox" />
        <a href="http://www.firefox.com.cn/download/thanks/" target="_blank">Firefox 最新安装包下载</a>
      </div>
      <div>
        <svg-icon icon="logos:microsoft-edge" />
        <a href="https://www.microsoft.com/zh-cn/edge/download" target="_blank">Edge windows 最新安装包下载</a>
      </div>
      <div>
        <img style="width: 22px;" src="https://se1.360simg.com/t01d046e485533dddc6.png" alt="">
        <a href="https://browser.360.cn/" target="_blank">360-chrome内核浏览器 最新安装包下载</a>
      </div>

      <a-divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import Cards from './cards.vue';
import SvgIcon from '../SvgIcon.vue';

defineProps({
  error: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss">
.broswers {
  & > div {
    display: flex;
    padding: 8px 0;

    a {
      color: #0366d6;
      margin-left: 12px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.writing {
  width: 320px;
  height: 200px;
  background-color: #3f3f3f;
  border: 1px solid #bbbbbb;
  border-radius: 6px 6px 4px 4px;
  position: relative;
}

.writing .topbar {
  position: absolute;
  width: 100%;
  height: 12px;
  background-color: #f1f1f1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.writing .topbar div {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  margin: 3px;
  float: left;
}

.writing .topbar div.green {
  background-color: #60d060;
}

.writing .topbar div.red {
  background-color: red;
}

.writing .topbar div.yellow {
  background-color: #e6c015;
}

.writing .code {
  padding: 15px;
}

.writing .code ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.writing .code ul li {
  background-color: #9e9e9e;
  width: 0;
  height: 7px;
  border-radius: 6px;
  margin: 10px 0;
}

.container {
  height: 100vh;
  overflow-y: auto;
  margin: 0 auto;
  padding: 156px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  -webkit-transition: -webkit-transform .5s;
  transition: -webkit-transform .5s;
  transition: transform .5s;
  transition: transform .5s, -webkit-transform .5s;
}

.stack-container {
  position: relative;
  width: 420px;
  height: 210px;
  -webkit-transition: width 1s, height 1s;
  transition: width 1s, height 1s;
}

.pokeup {
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
}

.pokeup:hover {
  -webkit-transform: translateY(-10px);
  transform: translateY(-10px);
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

.error {
  min-width: 400px;
  padding: 0 40px 40px 40px;
  text-align: center;
}

.error h1 {
  font-size: 116px;
  padding: 0;
  margin: 0;
  font-weight: 700;
}

.error h2 {
  margin: -30px 0 0 0;
  padding: 0px;
  font-size: 47px;
  letter-spacing: 12px;
}

.error p {
  color: #9e9999;
  font-weight: 600;
}

.perspec {
  -webkit-perspective: 1000px;
  perspective: 1000px;
}

.writeLine {
  -webkit-animation: writeLine .4s linear forwards;
  animation: writeLine .4s linear forwards;
}

.explode {
  -webkit-animation: explode .5s ease-in-out forwards;
  animation: explode .5s ease-in-out forwards;
}

.card {
  -webkit-animation: tiltcard .5s ease-in-out 1s forwards;
  animation: tiltcard .5s ease-in-out 1s forwards;
  position: absolute;
}

@-webkit-keyframes tiltcard {
  0% {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }

  100% {
    -webkit-transform: rotateY(-30deg);
    transform: rotateY(-30deg);
  }
}

@keyframes tiltcard {
  0% {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }

  100% {
    -webkit-transform: rotateY(-30deg);
    transform: rotateY(-30deg);
  }
}

@-webkit-keyframes explode {
  0% {
    -webkit-transform: translate(0, 0) scale(1);
    transform: translate(0, 0) scale(1);
  }

  100% {
    -webkit-transform: translate(var(--spreaddist), var(--vertdist)) scale(var(--scaledist));
    transform: translate(var(--spreaddist), var(--vertdist)) scale(var(--scaledist));
  }
}

@keyframes explode {
  0% {
    -webkit-transform: translate(0, 0) scale(1);
    transform: translate(0, 0) scale(1);
  }

  100% {
    -webkit-transform: translate(var(--spreaddist), var(--vertdist)) scale(var(--scaledist));
    transform: translate(var(--spreaddist), var(--vertdist)) scale(var(--scaledist));
  }
}

@-webkit-keyframes writeLine {
  0% {
    width: 0;
  }

  100% {
    width: var(--linelength);
  }
}

@keyframes writeLine {
  0% {
    width: 0;
  }

  100% {
    width: var(--linelength);
  }
}

@media screen and (max-width: 1000px) {
  .container {
    -webkit-transform: scale(.85);
    transform: scale(.85);
  }
}

@media screen and (max-width: 850px) {
  .container {
    -webkit-transform: scale(.75);
    transform: scale(.75);
  }
}

@media screen and (max-width: 775px) {
  .container {
    -ms-flex-wrap: wrap-reverse;
    flex-wrap: wrap-reverse;
    -webkit-box-align: inherit;
    -ms-flex-align: inherit;
    align-items: inherit;
  }
}

@media screen and (max-width: 370px) {
  .container {
    -webkit-transform: scale(.6);
    transform: scale(.6);
  }
}
</style>
