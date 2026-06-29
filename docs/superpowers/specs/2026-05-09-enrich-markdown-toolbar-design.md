# 2026-05-09 Enrich Markdown Toolbar Design

## 1. 背景与目标
为了提升用户在 TypeZen 中的 Markdown 编写体验，增加对标准 Markdown 语法的支持。本次更新侧重于高频使用的协作与结构化元素，包括表格、任务列表、文字高亮、上标和下标。

## 2. 详细设计内容

### 2.1 逻辑层扩展 (`app/_hooks/use-markdown-tools.ts`)
新增以下导出方法：
- `insertTable`: 插入一个 2x2 的基础表格结构，并自动选中第一个单元格。
- `insertTaskList`: 插入 `- [ ] ` 前缀，逻辑与现有的 `insertList` 一致。
- `insertHighlight`: 使用 `==` 包裹选中文本或占位符。
- `insertSuperscript`: 使用 `^` 包裹文本。
- `insertSubscript`: 使用 `~` 包裹文本。

### 2.2 UI 层更新 (`app/_components/markdown-editor-pane.tsx`)
- **图标依赖**: 引入 `Highlighter`, `CheckSquare`, `Table`, `Superscript`, `Subscript` (来自 `lucide-react`)。
- **分组调整**:
    - **样式组 (Styles)**: Bold, Italic, Strikethrough, **Highlight**.
    - **列表组 (Lists)**: Unordered, Ordered, **Task List**.
    - **插入组 (Insert)**: Link, Image, **Table**, Horizontal Rule.
    - **高级组 (Advanced)**: Inline Code, Code Block, **Superscript**, **Subscript**.

### 2.3 渲染支持 (`app/template-engine.ts`)
- 确保渲染引擎能够正确处理表格和任务列表。如果底层使用的 `marked` 库没有启用这些 GFM (GitHub Flavored Markdown) 扩展，需要进行配置。

## 3. 验收标准
1. 点击工具栏各新按钮，能在编辑器当前光标处插入正确的 Markdown 语法。
2. 插入内容后，光标应处于合理位置（如：选中占位符或在闭合标签前）。
3. 预览区应能正确渲染出表格、任务列表（复选框状态）、高亮背景。
4. 工具栏在移动端和桌面端布局整齐，不会出现布局错乱。
