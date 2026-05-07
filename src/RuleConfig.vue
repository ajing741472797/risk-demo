<template>
  <div class="rule-config-container">
    <!-- 规则配置区域 -->
    <div class="config-area">
      <el-button type="primary" size="mini" @click="addRootRule"
        >新增</el-button
      >

      <!-- 根规则列表 -->
      <RootRuleItem
        v-for="(rootRule, rootIndex) in ruleForm.rules"
        :key="rootIndex"
        :rule="rootRule"
        :index="rootIndex"
        :schema="ruleSchema"
        :isFirst="rootIndex === 0"
        @deleteRoot="deleteRule('root', rootIndex)"
        @deleteSub="deleteRule('sub', rootIndex, $event)"
        @addSubRule="addSubRule(rootIndex)"
        @ruleChange="handleRuleChange"
      ></RootRuleItem>

      <!-- 触发结果配置 -->
      <div class="result-config">
        <span>那么</span>
        <el-select
          v-model="ruleForm.triggerResult"
          size="mini"
          class="result-select"
          placeholder="请选择触发结果"
          @change="handleTriggerResultChange"
        >
          <el-option
            v-for="item in resultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span>否则</span>
        <el-select
          v-model="ruleForm.elseResult"
          size="mini"
          class="result-select"
          placeholder="请选择否则结果"
          @change="handleElseResultChange"
        >
          <el-option
            v-for="item in resultOptions_no"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>

    <!-- 规则测试区域 -->
    <RuleTest
      :testTree="testTree"
      :testForm="testForm"
      :ruleForm="ruleForm"
      :schema="ruleSchema"
      :testResult="testResult"
      @test="testRule"
      @testFormChange="handleTestFormChange"
    ></RuleTest>
  </div>
</template>

<script>
import RootRuleItem from "./components/RootRuleItem.vue";
import RuleTest from "./components/RuleTest.vue";

// 规则配置的JSON Schema（核心：定义规则结构和校验规则）
const ruleSchema = {
  type: "object",
  properties: {
    rules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          logic: { type: "string", enum: ["and", "or"], default: "and" },
          fieldType: {
            type: "string",
            enum: ["monthlyRecharge", "age"],
          },
          timeRangeNum: { type: "string", enum: ["1", "2", "3"] },
          timeRangeUnit: { type: "string", enum: ["month"] },
          operator: {
            type: "string",
            enum: ["gt", "lt", "eq", "gte", "lte"],
          },
          threshold: { type: "string", pattern: "^\\d+$" },
          subRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                logic: { type: "string", enum: ["and", "or"], default: "and" },
                fieldType: {
                  type: "string",
                  enum: ["monthlyRecharge", "age"],
                },
                valueType: {
                  type: "string",
                  enum: ["number"],
                  default: "number",
                },
                operator: {
                  type: "string",
                  enum: ["gt", "lt", "eq"],
                },
                threshold: {
                  type: "string",
                  pattern: "^\\d+$",
                },
              },
              required: ["fieldType", "operator", "threshold"],
            },
          },
        },
        required: ["fieldType", "operator", "threshold"],
      },
    },
    triggerResult: { type: "string", enum: ["pass", "fail"] },
    elseResult: { type: "string", enum: ["fail", "other"] },
  },
  required: ["rules", "triggerResult", "elseResult"],
};

// 字段/运算符/结果的映射配置（Schema驱动渲染）
const fieldOptions = [
  { label: "月均充值", value: "monthlyRecharge" },
  { label: "年龄", value: "age" },
];
const operatorOptions = [
  { label: "大于", value: "gt" },
  { label: "小于", value: "lt" },
  { label: "等于", value: "eq" },
  { label: "大于等于", value: "gte" },
  { label: "小于等于", value: "lte" },
];
const resultOptions = [{ label: "通过", value: "pass" }];
const resultOptions_no = [
  { label: "不通过", value: "fail" },
  { label: "转人工", value: "other" },
];
const fieldLabelMap = {
  monthlyRecharge: "月均充值",
  age: "年龄",
};

const logicLabelMap = {
  and: "且",
  or: "或",
};
const operatorLabelMap = {
  gt: ">",
  lt: "<",
  eq: "=",
  gte: ">=",
  lte: "<=",
};
const otherLabelMap = {
  month: "月",
};

export default {
  name: "RuleConfig",
  components: { RootRuleItem, RuleTest },
  props: {
    // 外部传入初始规则（支持复用组件时自定义初始值）
    initialRule: {
      type: Object,
      default: () => ({
        rules: [
          {
            logic: "and",
            fieldType: "monthlyRecharge",
            timeRangeNum: "1",
            timeRangeUnit: "month",
            operator: "gt",
            threshold: "0",
            subRules: [],
          },
        ],
        triggerResult: "pass",
        elseResult: "fail",
      }),
    },
  },
  data() {
    const initialForm = JSON.parse(JSON.stringify(this.initialRule));
    if (!initialForm.elseResult) {
      initialForm.elseResult = "fail";
    }
    return {
      ruleForm: initialForm, // 深拷贝避免修改源数据
      testForm: { monthlyRecharge: "", age: "" },
      ruleSchema, // JSON Schema规则
      // 映射配置（通过Props透传子组件）
      fieldOptions,
      operatorOptions,
      resultOptions,
      resultOptions_no,
      testResult: "",
    };
  },
  computed: {
    testTree() {
      return this.ruleForm.rules.map((rule, rootIndex) => ({
        key: this.getRootTestKey(rootIndex),
        label: this.getRuleLabel(rule, rootIndex, null),
        children: (rule.subRules || []).map((subRule, subIndex) => ({
          key: this.getSubTestKey(rootIndex, subIndex),
          label: this.getRuleLabel(subRule, rootIndex, subIndex),
        })),
      }));
    },
  },
  watch: {
    // 监听初始规则变化，更新表单
    initialRule: {
      handler(val) {
        const nextForm = JSON.parse(JSON.stringify(val));
        if (!nextForm.elseResult) {
          nextForm.elseResult = "fail";
        }
        this.ruleForm = nextForm;
        this.syncTestFormWithRules();
      },
      deep: true,
    },
  },
  methods: {
    // 新增根规则
    addRootRule() {
      const newRootRule = {
        logic: "and",
        fieldType: "monthlyRecharge",
        timeRangeNum: "1",
        timeRangeUnit: "month",
        operator: "gt",
        threshold: "0",
        subRules: [],
      };
      this.ruleForm.rules.push(newRootRule);
      this.syncTestFormWithRules();
      this.$emit("ruleChange", this.ruleForm); // 向外暴露规则变化事件
    },
    // 新增子规则
    addSubRule(rootIndex) {
      const newSubRule = {
        logic: "and",
        fieldType: "monthlyRecharge",
        timeRangeNum: "1",
        timeRangeUnit: "month",
        operator: "gt",
        threshold: "0",
      };
      this.ruleForm.rules[rootIndex].subRules.push(newSubRule);
      this.syncTestFormWithRules();
      this.$emit("ruleChange", this.ruleForm);
    },
    // 删除规则
    deleteRule(type, rootIndex, subIndex) {
      if (type === "root" && this.ruleForm.rules.length > 1) {
        this.ruleForm.rules.splice(rootIndex, 1);
      } else if (type === "sub") {
        this.ruleForm.rules[rootIndex].subRules.splice(subIndex, 1);
      }
      this.syncTestFormWithRules();
      this.$emit("ruleChange", this.ruleForm);
    },
    // 规则变化统一处理
    handleRuleChange() {
      this.$emit("ruleChange", this.ruleForm);
    },
    handleTriggerResultChange() {
      this.$emit("ruleChange", this.ruleForm);
    },
    handleElseResultChange() {
      this.$emit("ruleChange", this.ruleForm);
    },
    getRootTestKey(rootIndex) {
      return `root-${rootIndex}`;
    },
    getSubTestKey(rootIndex, subIndex) {
      return `root-${rootIndex}-sub-${subIndex}`;
    },
    getRuleLabel(rule, rootIndex, subIndex) {
      console.error("rule", rule);
      console.error("rootIndex", rootIndex);
      console.error("subIndex", subIndex);
      const logicText = logicLabelMap[rule.logic] || "?";
      const levelText =
        subIndex === null
          ? `${rootIndex + 1}`
          : `${rootIndex + 1}.${subIndex + 1}`;
      const fieldText = fieldLabelMap[rule.fieldType] || "未选字段";
      const operatorText = operatorLabelMap[rule.operator] || "?";
      const otherText = otherLabelMap[rule.timeRangeUnit] || "?";

      return `${"(" + logicText + ")"}${levelText}:${fieldText} ${
        rule.fieldType === "monthlyRecharge"
          ? rule.timeRangeNum + "个" + otherText
          : ""
      } ${operatorText} ${rule.threshold || "-"}`;
    },
    syncTestFormWithRules() {
      const nextForm = {};
      this.ruleForm.rules.forEach((rule, rootIndex) => {
        const rootKey = this.getRootTestKey(rootIndex);
        nextForm[rootKey] = this.testForm[rootKey] ?? "";
        (rule.subRules || []).forEach((_, subIndex) => {
          const subKey = this.getSubTestKey(rootIndex, subIndex);
          nextForm[subKey] = this.testForm[subKey] ?? "";
        });
      });
      this.testForm = nextForm;
    },
    // 测试表单变化处理
    handleTestFormChange(val) {
      this.testForm = val;
    },
    // 执行规则测试（基于JSON Schema校验规则合法性）
    testRule() {
      this.testResult = "";
      // 1. 用JSON Schema校验规则配置是否合法
      let validate;
      try {
        validate = this.$ajv.compile(this.ruleSchema);
      } catch (error) {
        this.$message.error(`规则Schema配置错误：${error.message}`);
        return;
      }

      const isValid = validate(this.ruleForm);
      if (!isValid) {
        const errorMsg = validate.errors.map((err) => err.message).join("；");
        this.$message.error(`规则配置不合法：${errorMsg}`);
        return;
      }

      // 2. 校验测试值
      const testValueEmpty = Object.values(this.testForm).some((val) => !val);
      if (testValueEmpty) {
        this.$message.warning("请填写完整测试值");
        return;
      }

      // 3. 解析规则判断匹配结果
      const isMatch = this.checkRuleMatch();
      const finalResult = isMatch
        ? this.ruleForm.triggerResult
        : this.ruleForm.elseResult;
      this.testResult =
        finalResult === "pass"
          ? "通过"
          : this.resultOptions_no.find((i) => i.value === finalResult)?.label;

      // 向外暴露测试结果
      this.$emit("testResult", this.testResult);
    },
    // 核心：校验规则是否匹配测试值
    checkRuleMatch() {
      let rootMatchResult = [];
      // 遍历根规则
      for (
        let rootIndex = 0;
        rootIndex < this.ruleForm.rules.length;
        rootIndex += 1
      ) {
        const rootRule = this.ruleForm.rules[rootIndex];
        let rootMatch = this.checkSingleRule(
          rootRule,
          this.testForm,
          this.getRootTestKey(rootIndex),
        );
        // 遍历子规则
        let subMatchList = rootRule.subRules.map((subRule, subIndex) =>
          this.checkSingleRule(
            subRule,
            this.testForm,
            this.getSubTestKey(rootIndex, subIndex),
          ),
        );
        if (subMatchList.length > 0) {
          rootMatch = rootMatch && subMatchList.every((item) => item);
        }
        rootMatchResult.push({ logic: rootRule.logic, match: rootMatch });
      }
      // 合并根规则结果
      let finalMatch = true;
      rootMatchResult.forEach((item, index) => {
        if (index === 0) {
          finalMatch = item.match;
        } else {
          finalMatch =
            item.logic === "and"
              ? finalMatch && item.match
              : finalMatch || item.match;
        }
      });
      return finalMatch;
    },
    // 校验单条规则
    checkSingleRule(rule, testValue, testKey) {
      const fieldValue = Number(testValue[testKey]);
      const threshold = Number(rule.threshold);
      switch (rule.operator) {
        case "gt":
          return fieldValue > threshold;
        case "lt":
          return fieldValue < threshold;
        case "eq":
          return fieldValue === threshold;
        case "gte":
          return fieldValue >= threshold;
        case "lte":
          return fieldValue <= threshold;
        default:
          return false;
      }
    },
  },
  created() {
    this.syncTestFormWithRules();
  },
};
</script>

<style scoped>
.rule-config-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.config-area {
  flex: 2;
  border: 1px solid #e6e6e6;
  padding: 10px;
  border-radius: 4px;
}
.result-config {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.result-select {
  width: 180px;
}
</style>
