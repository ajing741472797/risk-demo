<template>
  <div class="rule-group">
    <div class="rule-item">
      <!-- 逻辑符（仅非第一个根规则显示） -->
      <el-select
        v-if="!isFirst"
        v-model="rule.logic"
        size="mini"
        class="logic-select"
        @change="handleChange"
      >
        <el-option label="且" value="and"></el-option>
        <el-option label="或" value="or"></el-option>
      </el-select>

      <!-- 字段类型 -->
      <el-select
        v-model="rule.fieldType"
        size="mini"
        class="field-select"
        placeholder="请选择维度类型"
        @change="handleChange"
      >
        <el-option
          v-for="item in fieldOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <!-- 时间范围（仅月均充值显示） -->
      <el-select
        v-model="rule.timeRangeNum"
        size="mini"
        class="range-num"
        v-if="rule.fieldType === 'monthlyRecharge'"
        @change="handleChange"
      >
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
      </el-select>
      <el-select
        v-model="rule.timeRangeUnit"
        size="mini"
        class="range-unit"
        v-if="rule.fieldType === 'monthlyRecharge'"
        @change="handleChange"
      >
        <el-option label="月" value="month"></el-option>
      </el-select>

      <!-- 运算符 -->
      <el-select
        v-model="rule.operator"
        size="mini"
        class="operator-select"
        placeholder="请输入运算符"
        @change="handleChange"
      >
        <el-option
          v-for="item in operatorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <!-- 阈值 -->
      <el-input
        v-model="rule.threshold"
        size="mini"
        class="threshold-input"
        placeholder="请输入阈值"
        type="number"
        @change="handleChange"
      ></el-input>

      <!-- 操作按钮 -->
      <el-button size="mini" type="text" @click="$emit('addSubRule')"
        >新增分支</el-button
      >
      <el-button
        size="mini"
        type="text"
        @click="$emit('deleteRoot')"
        v-if="!isFirst"
        >删除</el-button
      >
    </div>

    <!-- 子规则列表 -->
    <SubRuleItem
      v-for="(subRule, subIndex) in rule.subRules"
      :key="subIndex"
      :rule="subRule"
      :index="subIndex"
      @delete="$emit('deleteSub', subIndex)"
      @ruleChange="handleChange"
    ></SubRuleItem>
  </div>
</template>

<script>
import SubRuleItem from "./SubRuleItem.vue";

export default {
  name: "RootRuleItem",
  components: { SubRuleItem },
  props: {
    rule: { type: Object, required: true },
    index: { type: Number, required: true },
    schema: { type: Object, required: true },
    isFirst: { type: Boolean, default: false },
  },
  data() {
    return {
      // 透传映射配置（也可通过Props传入，更灵活）
      fieldOptions: [
        { label: "月均充值", value: "monthlyRecharge" },
        { label: "年龄", value: "age" },
      ],
      operatorOptions: [
        { label: "大于", value: "gt" },
        { label: "小于", value: "lt" },
        { label: "等于", value: "eq" },
        { label: "大于等于", value: "gte" },
        { label: "小于等于", value: "lte" },
      ],
    };
  },
  methods: {
    handleChange() {
      this.$emit("ruleChange");
    },
  },
};
</script>

<style scoped>
.rule-group {
  margin: 10px 0;
}
.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  flex-wrap: wrap;
}
.logic-select {
  width: 60px;
}
.field-select {
  width: 180px;
}
.range-num {
  width: 60px;
}
.range-unit {
  width: 60px;
}
.operator-select {
  width: 120px;
}
.threshold-input {
  width: 100px;
}
</style>
