import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Ajv from "ajv";
Vue.config.productionTip = false;
Vue.use(ElementUI);
// 全局注册JSON Schema校验实例
const ajv = new Ajv({ allErrors: true, verbose: true });
Vue.prototype.$ajv = ajv;

function isLikelyExtensionError(source = "") {
  return /content\.js|chrome-extension|moz-extension|safari-web-extension/i.test(
    source,
  );
}

window.addEventListener("error", (event) => {
  const source = event.filename || "";
  const tag = isLikelyExtensionError(source) ? "[ExtensionError]" : "[AppError]";
  console.group(tag);
  console.error("message:", event.message);
  console.error("source:", source || "(unknown)");
  console.error("line:col:", `${event.lineno || 0}:${event.colno || 0}`);
  if (event.error) {
    console.error("stack:", event.error.stack || event.error);
  }
  console.groupEnd();
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason || {};
  const stack = typeof reason === "object" ? reason.stack || "" : "";
  const text = `${stack} ${reason}`.trim();
  const tag = isLikelyExtensionError(text) ? "[ExtensionPromiseError]" : "[AppPromiseError]";
  console.group(tag);
  console.error("reason:", reason);
  if (stack) {
    console.error("stack:", stack);
  }
  console.groupEnd();
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
