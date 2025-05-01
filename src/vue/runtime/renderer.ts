import type { IDemoCancelableFn } from 'dumi/dist/client/theme-api';
import Vue from 'vue';

// 创建实例前配置全局错误处理
Vue.config.errorHandler = function (err, vm, info) {
  // 在此处理错误（如发送日志、抛给上层）
  console.error('Vue 错误:', err, info);

  // 如果需要抛给外部（如 React 错误边界）
  throw err; // 抛出错误让上层捕获
};

const renderer: IDemoCancelableFn = async function (canvas, component) {
  if (component.__css__) {
    setTimeout(() => {
      document
        .querySelectorAll(`style[css-${component.__id__}]`)
        .forEach((el) => el.remove());
      document.head.insertAdjacentHTML(
        'beforeend',
        `<style css-${component.__id__}>${component.__css__}</style>`,
      );
    }, 1);
  }
  const app = new Vue(component)
  app.$mount(canvas);
  return () => {
    app.$destroy();
  };
};

export default renderer;
