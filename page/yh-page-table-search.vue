<template>
  <div class="yh-page-table-search">
    <!-- 1. 顶部查询表单 -->
    <yh-table-search-form v-if="searchFields && searchFields.length" ref="searchFormRef" :fields="searchFields" v-bind="searchFormProps" @search="handleSearch" @reset="handleReset">
      <!-- 透传外部自定义查询项插槽 -->
      <template v-for="slotKey in Object.keys($scopedSlots)" #[slotKey]="slotProps">
        <slot :name="slotKey" v-bind="slotProps" />
      </template>
    </yh-table-search-form>

    <!-- 2. 中间表格容器（自适应 Flex 剩余高度） -->
    <div class="yh-page-table-main">
      <yh-table ref="tableRef" :data="tableData" :loading="loading" v-bind="$attrs" v-on="$listeners">
        <!-- 透传外部列与所有默认插槽 -->
        <slot />
        <template v-if="$scopedSlots.append" #append>
          <slot name="append" />
        </template>
        <template v-if="$scopedSlots.empty" #empty>
          <slot name="empty" />
        </template>
      </yh-table>
    </div>

    <!-- 3. 底部固定分页 -->
    <div v-if="showPagination" class="yh-page-pagination">
      <el-pagination :current-page.sync="pagination.page" :page-size.sync="pagination.size" :total="pagination.total" :page-sizes="pageSizes" :layout="paginationLayout" background @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import YhTableSearchForm from "@/new-components/table/yh-table-search-form.vue";
import YhTable from "@/new-components/table/yh-table.vue";

const EL_TABLE_METHODS = ["clearSelection", "toggleRowSelection", "toggleAllSelection", "toggleRowExpansion", "setCurrentRow", "clearSort", "clearFilter", "doLayout", "sort"];

export default {
  name: "YhPageTableSearch",
  components: {
    YhTableSearchForm,
    YhTable,
  },
  inheritAttrs: false,
  props: {
    // 顶部搜索字段配置
    searchFields: {
      type: Array,
      default: () => [],
    },
    // 搜索表单的附加配置项
    searchFormProps: {
      type: Object,
      default: () => ({}),
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    // 默认每页条数
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    // 每页条数选项
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
    // 分页布局
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    // 是否在初始化时自动请求
    immediate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      searchParams: {},
      pagination: {
        page: 1,
        size: this.defaultPageSize,
        total: 0,
      },
    };
  },
  mounted() {
    this.proxyTableMethods();
    if (this.immediate) {
      this.fetchData();
    }
  },
  methods: {
    // 代理底层的 el-table 方法
    proxyTableMethods() {
      const table = this.$refs.tableRef;
      if (!table) return;
      EL_TABLE_METHODS.forEach((method) => {
        this[method] = (...args) => table[method](...args);
      });
    },

    // 触发数据加载主流程
    async fetchData() {
      const requestParams = Object.assign(
        {},
        this.searchParams,
        this.showPagination
          ? {
              page: this.pagination.page,
              size: this.pagination.size,
            }
          : {}
      );

      this.loading = true;

      // 支持 Promise 模式和回调函数模式
      const handleResult = (res) => {
        if (res && (res.code === 200 || res.code === 0) && res.data) {
          const payload = res.data;
          this.tableData = Array.isArray(payload.data) ? payload.data : [];
          if (this.showPagination) {
            this.pagination.total = Number(payload.total) || 0;
            this.pagination.page = Number(payload.page) || this.pagination.page;
            this.pagination.size = Number(payload.size) || this.pagination.size;
          }
        }
        this.loading = false;
      };

      try {
        this.$emit("load", requestParams, handleResult);
      } catch (err) {
        this.loading = false;
      }
    },

    // 查询按钮点击
    handleSearch(params) {
      this.searchParams = Object.assign({}, params);
      this.pagination.page = 1;
      this.fetchData();
    },

    // 重置按钮点击
    handleReset(params) {
      this.searchParams = Object.assign({}, params);
      this.pagination.page = 1;
      this.fetchData();
    },

    // 页码改变
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchData();
    },

    // 条数改变
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.page = 1;
      this.fetchData();
    },

    // 供外部手动调用刷新表格
    refresh(resetPage = false) {
      if (resetPage) {
        this.pagination.page = 1;
      }
      this.fetchData();
    },
  },
};
</script>

<style scoped>
.yh-page-table-search {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  overflow: hidden;
}

.yh-page-table-main {
  flex: 1;
  min-height: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
}

.yh-page-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-top: 1px solid #f0f2f5;
  flex-shrink: 0;
}
</style>
