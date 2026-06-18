# Codex 任务提示词包

## 使用方式

按顺序执行。

不要一次性要求 Codex 完成所有事情。

每个任务完成后，先检查：
- 代码是否能运行
- 测试是否通过
- 评分逻辑是否仍然是纯函数
- 是否没有收集个人身份信息
- 是否没有数据库/localStorage/sessionStorage/cookie

---

## Task 0：初始化项目

请基于当前仓库创建一个 Next.js + TypeScript + Tailwind CSS 项目。

请严格遵守 AGENTS.md 和 docs/product-spec.md。

要求：

1. 使用 App Router。
2. 使用 TypeScript strict mode。
3. 添加 Tailwind CSS。
4. 添加 Vitest 测试框架。
5. 添加 npm scripts：
   - dev
   - build
   - lint
   - test
6. 保留并使用现有的：
   - src/lib/fitness/types.ts
   - src/lib/fitness/standards.ts
7. 不要添加数据库。
8. 不要添加登录。
9. 不要添加 localStorage/sessionStorage/cookie 存储体测数据。
10. 不要添加大模型调用。

完成后运行：

```bash
npm test
npm run build
npm run lint
```
