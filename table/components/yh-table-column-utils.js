/**
 * 1. 根据 label 匹配规则列表（后续自行补充 pattern 与 config）
 */
export const LABEL_PRESETS = [
  // 示例占位：
  // { pattern: /金额|价格/, config: { align: 'right', minWidth: 120 } }
  { pattern: /金额|价格/, config: { align: "right", minWidth: 120 } },
];

/**
 * 2. 根据 prop 匹配规则列表（后续自行补充 pattern 与 config）
 */
export const PROP_PRESETS = [
  // 示例占位：
  // { pattern: /time|date/i, config: { minWidth: 160, align: 'center' } }
  { pattern: /time|date/i, config: { width: 180, align: "left" } },
];

/**
 * 3. 根据是否有 viewClick 事件时的匹配规则
 * 当外部绑定了 @viewClick 时自动注入该默认配置
 */
export const VIEW_CLICK_PRESET = {
  // 存在 viewClick 时的通用列属性预设（后续自行补充或修改）
  config: {
    minWidth: 120,
    showOverflowTooltip: true,
  },
  // 存在 viewClick 时的文本行内样式预设
  style: {
    color: "#409EFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
