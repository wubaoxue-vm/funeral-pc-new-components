<template>
  <el-table-column v-bind="mergedProps" v-on="$listeners">
    <!-- 优先级 1：外部传入自定义插槽，最高优先级直接透传 -->
    <template v-if="$scopedSlots.default" #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
    <!-- 优先级 2：外部绑定了 @viewClick 事件时，自动渲染为可点击交互文本 -->
    <template v-else-if="hasViewClick" #default="scope">
      <span class="clickable-text" @click.stop="handleViewClick(scope)">
        {{ scope.row[mergedProps.prop] }}
      </span>
    </template>
    <!-- 优先级 3：命中 label 或 prop 预设中的样式/标签逻辑 -->
    <template v-else #default="scope">
      <yh-table-column-cell-render :row="scope.row" :prop="mergedProps.prop" />
    </template>
    <!-- 优先级 4：兜底情况，由 el-table-column 原生逻辑渲染内容 -->
  </el-table-column>
</template>

<script>
import { LABEL_PRESETS, PROP_PRESETS, VIEW_CLICK_PRESET } from "./components/yh-table-column-utils";
import YhTableColumnCellRender from "./components/yh-table-column-cell-render";

export default {
  name: "YhTableColumn",
  components: {
    YhTableColumnCellRender,
  },
  inheritAttrs: false,

  props: {
    // 列名属性
    label: {
      type: String,
      default: "",
    },
    // 字段名属性
    prop: {
      type: String,
      default: "",
    },
  },
  computed: {
    // 判断当前组件外部是否监听了 viewClick 事件
    hasViewClick() {
      return Boolean(this.$listeners && this.$listeners.viewClick);
    },

    // 1. 根据 label 匹配到的规则配置
    matchedLabelPreset() {
      const target = this.label || this.$attrs.label || "";
      const match = LABEL_PRESETS.find((item) => item.pattern && item.pattern.test(target));
      return match ? match.config : {};
    },

    // 2. 根据 prop 匹配到的规则配置
    matchedPropPreset() {
      const target = this.prop || this.$attrs.prop || "";
      const match = PROP_PRESETS.find((item) => item.pattern && item.pattern.test(target));
      return match ? match.config : {};
    },

    // 3. 根据是否有 viewClick 事件获取的规则配置
    matchedEventPreset() {
      if (this.hasViewClick) {
        return VIEW_CLICK_PRESET.config || {};
      }
      return {};
    },

    // 提取 viewClick 触发时的文本样式
    eventPresetStyle() {
      return (VIEW_CLICK_PRESET && VIEW_CLICK_PRESET.style) || {};
    },

    // 预设合并中间态（用于模板中判断 style、useTag 等渲染分支）
    combinedPreset() {
      return Object.assign({}, this.matchedLabelPreset, this.matchedPropPreset, this.matchedEventPreset);
    },

    // 全局基础兜底配置
    baseDefaults() {
      return {
        align: "left",
        headerAlign: "left",
        showOverflowTooltip: true,
        minWidth: 100,
      };
    },

    /**
     * 最终属性合并优先级（从低到高覆盖）：
     * 1. baseDefaults（全局基础配置）
     * 2. matchedLabelPreset（按 label 匹配）
     * 3. matchedPropPreset（按 prop 匹配，优先级高于 label）
     * 4. matchedEventPreset（按 viewClick 事件匹配）
     * 5. 显式 props: { label, prop }
     * 6. this.$attrs（外部直接在标签显式书写的属性，优先级最高）
     */
    mergedProps() {
      return Object.assign(
        {},
        this.baseDefaults,
        this.matchedLabelPreset,
        this.matchedPropPreset,
        this.matchedEventPreset,
        {
          label: this.label,
          prop: this.prop,
        },
        this.$attrs
      );
    },
  },
  methods: {
    // 触发外部 viewClick 事件，向外抛出完整 scope 数据
    handleViewClick(scope) {
      this.$emit("viewClick", scope);
    },
  },
};
</script>
<style scoped>
.clickable-text {
  outline: 0;
  padding: 0;
  font-weight: 500;
  color: #409eff;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  /* 关键：自主接管单行超出省略，保证 '...' 与文本颜色同步 */
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.clickable-text:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
  color: #3081d6;
}
</style>
<style>
/* ================= 基础结构（所有单元格通用） ================= */
.yh-cell-wrapper {
  display: inline-flex;
  align-items: center;
  position: relative;
  vertical-align: middle;
  line-height: 1.2;
}

.yh-cell-icon {
  margin-right: 5px;
  font-size: 13px;
}

.yh-cell-text {
  font-size: 13px;
  white-space: nowrap;
}

/* ================= 形态修饰符（按需组合） ================= */

/* 1. 时间形态：数字等宽排版、带右上角徽标 */
.yh-cell-wrapper.is-time .yh-cell-icon {
  color: #909399;
}

.yh-cell-wrapper.is-time .yh-cell-text {
  color: #303133;
  font-variant-numeric: tabular-nums;
}

.yh-cell-wrapper.is-time .yh-cell-badge {
  position: absolute;
  top: -13px;
  right: -11px;
  transform: scale(0.82);
  transform-origin: left center;
  padding: 1px 5px;
  font-size: 12px;
  line-height: 14px;
  color: #909399;
  background-color: #f4f4f5;
  border: 1px solid #e9e9eb;
  border-radius: 10px;
  white-space: nowrap;
  user-select: none;
}

/* 2. 标签形态：背景底色、轻量圆角边框（用于部门、角色等） */
.yh-cell-wrapper.is-tag {
  line-height: 1.4;
  padding: 2px 8px;
  background-color: #f0f7ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
}

.yh-cell-wrapper.is-tag .yh-cell-icon,
.yh-cell-wrapper.is-tag .yh-cell-text {
  color: #409eff;
}

/* 单元格溢出处理（父级 cell 穿透） */
.el-table .cell:has(.yh-cell-wrapper.is-time) {
  overflow: visible !important;
}
</style>
