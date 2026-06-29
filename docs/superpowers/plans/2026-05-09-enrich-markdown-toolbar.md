# Enrich Markdown Toolbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the Markdown editor toolbar with Table, Task List, Highlight, Superscript, and Subscript features.

**Architecture:** 
1. Extend `useMarkdownTools` hook with new insertion methods.
2. Update `MarkdownEditorPane` component to include new buttons and icons.
3. Update `template-engine.ts` to support rendering of Highlight, Subscript, and Superscript (Tables and Task Lists are already supported by GFM in `marked`).

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Lucide React, Marked.js.

---

### Task 1: Extend `useMarkdownTools` Hook

**Files:**
- Modify: `app/_hooks/use-markdown-tools.ts`

- [ ] **Step 1: Add new insertion methods**

Add `insertTable`, `insertHighlight`, `insertSuperscript`, and `insertSubscript`. `insertTaskList` can be handled by modifying `insertList` or adding a new one.

```typescript
// Add to return object and implement
const insertTable = useCallback(() => {
  const textarea = inputRef.current;
  if (!textarea) return;
  const scrollTop = textarea.scrollTop;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const tableTemplate = "\n| 标题 | 标题 |\n| --- | --- |\n| 内容 | 内容 |\n";
  const newText = inputText.substring(0, start) + tableTemplate + inputText.substring(end);
  setInputText(newText);
  setTimeout(() => {
    textarea.focus();
    textarea.scrollTop = scrollTop;
    // Select the first "标题"
    textarea.setSelectionRange(start + 3, start + 5);
  }, 0);
}, [inputRef, inputText, setInputText]);

const insertHighlight = useCallback(() => {
  insertMarkdown("==", "==", "高亮文字");
}, [insertMarkdown]);

const insertSuperscript = useCallback(() => {
  insertMarkdown("^", "^", "上标");
}, [insertMarkdown]);

const insertSubscript = useCallback(() => {
  insertMarkdown("~", "~", "下标");
}, [insertMarkdown]);
```

- [ ] **Step 2: Update return values**

### Task 2: Update `MarkdownEditorPane` UI

**Files:**
- Modify: `app/_components/markdown-editor-pane.tsx`

- [ ] **Step 1: Import new icons from `lucide-react`**
Import `Highlighter`, `CheckSquare`, `Table`, `Superscript`, `Subscript`.

- [ ] **Step 2: Update `MarkdownEditorPaneProps` type definition**
Add the new methods to the props.

- [ ] **Step 3: Add new buttons to the toolbar**
Group buttons according to the design (Style, List, Insert, Advanced).

### Task 3: Update `Home` Component

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Pass new methods from `markdownTools` to `MarkdownEditorPane`**

### Task 4: Support Custom Rendering in `template-engine.ts`

**Files:**
- Modify: `app/template-engine.ts`

- [ ] **Step 1: Add regex replacements for Highlight, Subscript, and Superscript**

Since `marked` doesn't support these out of the box, we can add a simple pre-processing step or a `marked` extension. Given the current structure, a simple regex replacement before `marked.parse` is easiest.

```typescript
// In renderArticle function
let processedText = markdownText
  .replace(/==(.+?)==/g, '<mark style="background-color: yellow; color: black;">$1</mark>')
  .replace(/\^(.+?)\^/g, '<sup>$1</sup>')
  .replace(/~(.+?)~/g, '<sub>$1</sub>');
```
*Note: We should ensure these don't conflict with other syntax.*

Actually, using `marked` extensions is better.

```typescript
marked.use({
  extensions: [
    {
      name: 'highlight',
      level: 'inline',
      start(src) { return src.indexOf('=='); },
      tokenizer(src) {
        const match = /^==([^=]+)==/.exec(src);
        if (match) {
          return { type: 'highlight', raw: match[0], text: match[1] };
        }
      },
      renderer(token) {
        return `<mark style="background-color: ${template.themeColor}80; color: inherit; padding: 0 2px;">${token.text}</mark>`;
      }
    }
  ]
});
```

### Task 5: Verification

- [ ] **Step 1: Verify Table insertion**
- [ ] **Step 2: Verify Task List insertion**
- [ ] **Step 3: Verify Highlight insertion and rendering**
- [ ] **Step 4: Verify Sub/Sup insertion and rendering**
- [ ] **Step 5: Verify layout responsiveness**
