<template>
  <div class="sub-rule-item">
    <div class="rule-item">
      <!-- 逻辑符 -->
      <el-select
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
        placeholder="请选择特征"
        @change="handleChange"
      >
        <el-option label="月均充值" value="monthlyRecharge"></el-option>
        <el-option label="年龄" value="age"></el-option>
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
        placeholder="请选择"
        @change="handleChange"
      >
        <el-option label="大于" value="gt"></el-option>
        <el-option label="小于" value="lt"></el-option>
        <el-option label="等于" value="eq"></el-option>
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

      <!-- 删除按钮 -->
      <el-button size="mini" type="text" @click="$emit('delete')"
        >删除</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SubRuleItem",
  props: {
    rule: { type: Object, required: true },
    index: { type: Number, required: true },
  },
  methods: {
    handleChange() {
      this.$emit("ruleChange");
    },
  },
};
</script>

<style scoped>
.sub-rule-item {
  margin-left: 20px;
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
.value-type-select {
  width: 100px;
}
.operator-select {
  width: 120px;
}
.threshold-input {
  width: 100px;
}
</style>
