import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/indicator",
  },
  {
    path: "/indicator",
    name: "IndicatorManage",
    component: () => import("../views/IndicatorManage.vue"),
    meta: { title: "指标管理" },
  },
  {
    path: "/model",
    name: "ModelManage",
    component: () => import("../views/ModelManage.vue"),
    meta: { title: "模型管理" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - Demo`;
  }
});

export default router;
