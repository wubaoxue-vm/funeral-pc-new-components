import { formatRelativeTime } from "@/new-components/utils/DateTimeUtils";

export default {
  name: "YhTableColumnCellRender",
  functional: true,
  props: {
    row: {
      type: Object,
      required: true,
    },
    prop: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { row, prop, label } = context.props;
    let value = row[prop];

    switch (prop) {
      case "createTime":
      case "updateTime": {
        const badgeText = formatRelativeTime(value);
        return h("span", { class: ["yh-cell-wrapper", "is-time"] }, [
          // 前置图标
          h("i", { class: "el-icon-time yh-cell-icon" }),
          // 主文本
          h("span", { class: "yh-cell-text" }, value || "-"),
          // 角标（仅有值时渲染）
          badgeText ? h("span", { class: "yh-cell-badge" }, badgeText) : null,
        ]);
      }

      case "deptName": {
        return h("span", { class: ["yh-cell-wrapper"] }, [
          // 前置图标
          h("i", { class: "el-icon-office-building yh-cell-icon" }),
          // 主文本
          h("span", { class: "yh-cell-text" }, value || "-"),
        ]);
      }
    }
    return h("span", value);
  },
};
