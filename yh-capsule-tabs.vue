<template>
  <div class="yh-capsule-tabs">
    <div class="capsule-tabs-header">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        class="capsule-tab-item"
        :class="{ 'is-active': activeName === tab }"
        @click="handleClick(tab, i)"
      >
        {{ tab }}
      </div>
    </div>
    <div class="capsule-tabs-divider" />
    <div class="capsule-tabs-content">
      <div v-for="(tab, i) in tabs" :key="i" v-show="activeName === tab" class="capsule-tabs-pane">
        <slot :name="`defaultTab${i}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "YhCapsuleTabs",
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
    },
  },
};
</script>

<style lang="scss" scoped>
.yh-capsule-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .capsule-tabs-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    flex-shrink: 0;

    .capsule-tab-item {
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
        font-weight: 600;
      }
    }
  }

  .capsule-tabs-divider {
    height: 1px;
    background: #e2e8f0;
    flex-shrink: 0;
  }

  .capsule-tabs-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;

    .capsule-tabs-pane {
      height: 100%;
    }
  }
}
</style>
