<template>
  <div id="app">
    <el-container class="layout">
      <el-aside width="220px" class="aside">
        <div class="brand">Demo</div>
        <el-menu
          :router="true"
          :default-active="activeMenu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/indicator">
            <i class="el-icon-data-analysis"></i>
            <span slot="title">指标管理</span>
          </el-menu-item>
          <el-menu-item index="/model">
            <i class="el-icon-cpu"></i>
            <span slot="title">模型管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  box-sizing: border-box;
}

.layout {
  min-height: 100vh;
}

.aside {
  background-color: #304156;
  overflow: hidden;
}

.brand {
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.aside .el-menu {
  border-right: none;
}

.main {
  background: #f5f7fa;
  padding: 24px;
  box-sizing: border-box;
}

.card {
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

pre {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
  margin: 12px 0 0;
}
</style>
