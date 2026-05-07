<template>
  <div class="test-area">
    <h3>规则测试</h3>
    <div class="test-group" v-for="group in testTree" :key="group.key">
      <div class="test-item">
        <label class="test-label">{{ group.label }}</label>
        <el-input
          v-model="testForm[group.key]"
          size="mini"
          class="test-input"
          inputmode="numeric"
          @change="handleTestFormChange"
        ></el-input>
      </div>
      <div class="sub-test-list" v-if="group.children && group.children.length">
        <div
          class="test-item sub-test-item"
          v-for="child in group.children"
          :key="child.key"
        >
          <label class="test-label">{{ child.label }}</label>
          <el-input
            v-model="testForm[child.key]"
            size="mini"
            class="test-input"
            inputmode="numeric"
            @change="handleTestFormChange"
          ></el-input>
        </div>
      </div>
    </div>

    <el-button type="primary" size="mini" @click="$emit('test')"
      >测试</el-button
    >
    <div class="test-result" v-if="testResult">测试结果：{{ testResult }}</div>
  </div>
</template>

<script>
export default {
  name: "RuleTest",
  props: {
    testTree: { type: Array, required: true },
    testForm: { type: Object, required: true },
    ruleForm: { type: Object, required: true },
    schema: { type: Object, required: true },
    testResult: { type: String, default: "" },
  },
  methods: {
    handleTestFormChange() {

    console.error('this.testTree',this.testTree);
      this.$emit("testFormChange", this.testForm);
    },
  },
};
</script>

<style scoped>
.test-area {
  flex: 1;
  border: 1px solid #e6e6e6;
  padding: 10px;
  border-radius: 4px;
}
.test-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}
.test-group {
  border: 1px dashed #e6e6e6;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 10px;
}
.test-label {
  flex: 1;
}
.sub-test-list {
  margin-left: 14px;
  padding-left: 10px;
  border-left: 2px solid #ebeef5;
}
.sub-test-item {
  margin-top: 6px;
}
.test-input {
  width: 120px;
}
.test-result {
  margin-top: 10px;
  color: #1989fa;
  font-weight: bold;
}
</style>
