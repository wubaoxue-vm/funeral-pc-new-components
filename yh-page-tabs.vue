<template>
  <div class="yh-page-tabs">
    <div class="page-tabs-header">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        class="page-tab-item"
        :class="{ 'is-active': activeName === tab }"
        @click="handleClick(tab, i)"
      >
        {{ tab }}
      </div>
    </div>
    <div class="page-tabs-divider" />
    <div class="page-tabs-content">
      <div v-for="(tab, i) in tabs" :key="i" v-show="activeName === tab" class="page-tabs-pane">
        <slot :name="`defaultTab${i}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "YhPageTabs",
  props: {
    tabs: {
      default: () => [],
    },
    beforeLeave: {
      default: undefined,
    },
  },
  data() {
    return {
      activeName: this.tabs[0],
    };
  },
  methods: {
    async handleClick(tab, index) {
      if (this.activeName === tab) return;
      if (typeof this.beforeLeave === "function") {
        const canLeave = await this.beforeLeave(this.activeName, tab);
        if (canLeave === false) return;
      }
      this.activeName = tab;
      this.$emit("handleClick", index, this.activeName);
      // 切换后重新布局，避免隐藏的表格从 display:none 切换为显示时列宽错乱
      this.$nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.yh-page-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f6fafd;
  border: 1px solid #e6edf5;
  border-radius: 12px;
  box-shadow: 0px 8px 24px 0px rgba(15, 23, 42, 0.06);
  overflow: hidden;

  .page-tabs-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    flex-shrink: 0;

    .page-tab-item {
      padding: 8px 16px;
      border-radius: 8px;
      font-family: "PingFang SC";
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      color: #64748b;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;

      &:hover {
        color: #38afff;
      }

      &.is-active {
        background: #e8f3ff;
        color: #38afff;
        font-weight: 500;
        text-shadow: 0.5px 0 0 currentColor;
      }
    }
  }

  .page-tabs-divider {
    height: 1px;
    background: #e2e8f0;
    flex-shrink: 0;
  }

  .page-tabs-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;

    .page-tabs-pane {
      height: 100%;
    }
  }
}
</style>
