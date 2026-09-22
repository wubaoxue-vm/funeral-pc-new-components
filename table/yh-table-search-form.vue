<template>
  <div class="yh-search-form-container">
    <el-form ref="searchFormRef" :model="formData" :inline="true" size="small" class="yh-search-form" @submit.native.prevent @keyup.enter.native="handleSearch">
      <!-- 1. 配置项循环渲染 -->
      <el-form-item v-for="item in visibleFields" :key="item.prop" :label="item.label" :prop="item.prop">
        <!-- 插槽优先：支持外部自定义某个特定字段的内容 -->
        <slot :name="item.prop" :form="formData" :field="item">
          <!-- 文本输入框 -->
          <el-input v-if="!item.type || item.type === 'input'" v-model.trim="formData[item.prop]" :placeholder="item.placeholder || `请输入${item.label}`" :clearable="item.clearable !== false" :style="{ width: item.width || defaultItemWidth }" />
          <!-- 下拉选择器 -->
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop]" :placeholder="item.placeholder || `请选择${item.label}`" :clearable="item.clearable !== false" :multiple="item.multiple" :filterable="item.filterable" :style="{ width: item.width || defaultItemWidth }" @change="item.autoSearch ? handleSearch() : null">
            <el-option v-for="opt in item.options || []" :key="opt[item.valueKey || 'value']" :label="opt[item.labelKey || 'label']" :value="opt[item.valueKey || 'value']" />
          </el-select>
          <!-- 日期/时间选择器 -->
          <el-date-picker v-else-if="item.type === 'date' || item.type === 'daterange' || item.type === 'datetime'" v-model="formData[item.prop]" :type="item.type" :placeholder="item.placeholder || `请选择${item.label}`" :start-placeholder="item.startPlaceholder || '开始时间'" :end-placeholder="item.endPlaceholder || '结束时间'" :value-format="item.valueFormat || (item.type === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss')" :clearable="item.clearable !== false" :style="{ width: item.width || (item.type === 'daterange' ? '240px' : defaultItemWidth) }" />
        </slot>
      </el-form-item>
      <!-- 2. 操作按钮组 -->
      <el-form-item class="yh-search-action-item">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"> 查询 </el-button>
        <el-button icon="el-icon-refresh-right" @click="handleReset"> 重置 </el-button>
        <!-- 外部追加按钮插槽（如：导出、新建等） -->
        <slot name="extra-actions" />
        <!-- 展开 / 收起 切换开关 -->
        <el-button v-if="hasCollapse" type="text" class="yh-collapse-btn" @click="toggleCollapse">
          {{ isExpanded ? "收起" : "展开" }}
          <i :class="isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "YhTableSearchForm",
  props: {
    // 查询项表单配置项列表
    fields: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 默认控件宽度
    defaultItemWidth: {
      type: String,
      default: "180px",
    },
    // 折叠模式下默认展示的项目数量
    collapseCount: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      formData: {},
      isExpanded: false,
    };
  },
  computed: {
    hasCollapse() {
      return this.fields.length > this.collapseCount;
    },
    visibleFields() {
      if (!this.hasCollapse || this.isExpanded) {
        return this.fields;
      }
      return this.fields.slice(0, this.collapseCount);
    },
  },
  watch: {
    fields: {
      handler(newFields) {
        this.initFormData(newFields);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initFormData(fields) {
      const data = {};
      fields.forEach((item) => {
        data[item.prop] = item.defaultValue !== undefined ? item.defaultValue : "";
      });
      this.formData = Object.assign({}, data, this.formData);
    },
    handleSearch() {
      this.$emit("search", Object.assign({}, this.formData));
    },
    handleReset() {
      this.$refs.searchFormRef.resetFields();
      this.initFormData(this.fields);
      this.$emit("reset", Object.assign({}, this.formData));
      this.handleSearch();
    },
    toggleCollapse() {
      this.isExpanded = !this.isExpanded;
      this.$emit("collapse-change", this.isExpanded);
    },
  },
};
</script>

<style scoped>
.yh-search-form-container {
  background-color: #fff;
}

.yh-search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.yh-search-form ::v-deep .el-form-item {
  margin-bottom: 0;
  margin-right: 0;
}

.yh-search-form ::v-deep .el-form-item__label {
  font-weight: 500;
  color: #606266;
  padding-right: 8px;
}

.yh-search-action-item {
  margin-left: auto;
}

.yh-collapse-btn {
  margin-left: 8px;
  font-size: 13px;
  user-select: none;
}
</style>
