<template>
  <div class="yh-table-container" :class="{ 'is-fit-content': fitContent }">
    <!-- 表格滚动主体区域 -->
    <div class="yh-table-body-wrapper">
      <el-table ref="elTable" v-loading="loading" v-bind="computedTableProps" v-on="$listeners">
        <template v-if="$scopedSlots.default">
          <slot />
        </template>

        <template v-if="$scopedSlots.append" #append>
          <slot name="append" />
        </template>

        <template v-if="$scopedSlots.empty" #empty>
          <slot name="empty" />
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
const EL_TABLE_METHODS = ["clearSelection", "toggleRowSelection", "toggleAllSelection", "toggleRowExpansion", "setCurrentRow", "clearSort", "clearFilter", "doLayout", "sort"];

export default {
  name: "YhTable",
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * true: 高度根据内容动态自适应撑开（自然流动）
     * false: 适应父级 flex 剩余高度并开启内部滚动（占满剩余空间）
     */
    fitContent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseDefaults() {
      return {
        border: true,
        stripe: true,
      };
    },
    computedTableProps() {
      const merged = Object.assign({}, this.baseDefaults, this.$attrs);

      if (this.fitContent) {
        // 模式 1：动态撑开，剔除 height 属性
        delete merged.height;
      } else {
        // 模式 2：Flex 自适应充满并开启滚动条，默认赋 '100%'
        if (!merged.height) {
          merged.height = "100%";
        }
      }
      return merged;
    },
  },
  mounted() {
    this.proxyMethods();
  },
  methods: {
    proxyMethods() {
      const table = this.$refs.elTable;
      if (!table) return;
      EL_TABLE_METHODS.forEach((method) => {
        this[method] = (...args) => table[method](...args);
      });
    },
  },
};
</script>

<style scoped>
/* 默认模式：占满父级 Flex 容器剩余空间 */
.yh-table-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0; /* 关键：防止 flex 子项被内容撑破 */
}

/* 表格包裹层：填充剩余空间并激活纵向滚动 */
.yh-table-body-wrapper {
  flex: 1;
  min-height: 0; /* 关键：确保内部表格能正确计算 100% 高度并出滚动条 */
  width: 100%;
}

/* 模式 1：动态撑开模式（解除高度限制与 flex 强占） */
.yh-table-container.is-fit-content {
  height: auto;
  flex: none;
}
.yh-table-container.is-fit-content .yh-table-body-wrapper {
  height: auto;
  flex: none;
}
</style>
