<template>
  <div class="page-wrap">
    <el-card shadow="never">
      <div slot="header" class="card-header">
        <span class="title">指标管理</span>
      </div>
      <RuleConfig
        :initialRule="customInitialRule"
        @ruleChange="handleRuleChange"
        @testResult="handleTestResult"
      />
    </el-card>
  </div>
</template>

<script>
import RuleConfig from "../RuleConfig.vue";

export default {
  name: "IndicatorManage",
  components: {
    RuleConfig,
  },
  data() {
    return {
      customInitialRule: {
        rules: [
          {
            logic: "and",
            fieldType: "monthlyRecharge",
            timeRangeNum: "1",
            timeRangeUnit: "month",
            operator: "gt",
            threshold: "18",
            subRules: [],
          },
        ],
        triggerResult: "pass",
        elseResult: "fail",
      },
    };
  },
  methods: {
    handleRuleChange(rule) {
      console.log("当前规则配置：", rule);
    },
    handleTestResult(result) {
      console.log("规则测试结果：", result);
    },
  },
};
</script>

<style scoped>
.page-wrap {
  max-width: 100%;
  margin: 0 auto;
}
</style>
