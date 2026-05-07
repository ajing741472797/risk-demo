<template>
  <div class="page-wrap">
    <RuleConfig
      :initialRule="customInitialRule"
      @ruleChange="handleRuleChange"
      @testResult="handleTestResult"
    />
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
