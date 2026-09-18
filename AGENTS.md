# lemon-admin

pnpm + Turborepo monorepo。Node `>=22`，只用 pnpm（`>=12`）。

## 工作区

- `apps/*` — 应用（`admin`、`web`）
- `packages/web/*` — 前端共享包（`web-ui`、`web-i18n`）
- `internal/*` — 内部工具（`tsconfig`、`vite-config`）

## 规范索引

本文件只含仓库级约定。子树规范工作涉及才读：

| 范围                           | 文件                   |
| ------------------------------ | ---------------------- |
| apps React 组件 / Hooks / 命名 | `apps/admin/AGENTS.md` |

## 命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint          # oxlint
pnpm lint:fix
pnpm format        # oxfmt
pnpm format:check
pnpm typecheck
```

## 代码约定

- 格式化用 oxfmt，不要用 Prettier / ESLint 修格式。
- Lint 用 oxlint。保存时走 oxc（见 `.vscode/settings.json`）。
- 风格：单引号、分号、`printWidth: 100`、2 空格、ES5 trailing comma。
- 包管理：workspace 依赖用 `workspace:*`，版本走 `pnpm-workspace.yaml` catalogs。
- 不要提交 `.env*`、lockfile 以外的包管理器锁文件。
- 不要用 `git commit --no-verify` / `--no-gpg-sign` 绕过 hook。

## 提交

commitlint 使用 `@commitlint/config-conventional`（`.commitlintrc.json`）。
写 commit message 时加载 `committing-with-commitlint` 技能。

## 技能

技能位于 `.agents/skills/`。权威清单以该目录为准。

## Web React

写 / 改 `apps/` 下 React 应用（`apps/admin`、`apps/web`）时按这个顺序：

1. 读 `apps/admin/AGENTS.md`。那是 **强制工作流**（组件写法、Hooks、命名）。和技能冲突时以它为准。
2. 加载 `.agents/skills/` 里的 `vercel-react-best-practices`。只取性能意图：消灭瀑布流、缩小 bundle、数据请求去重、派生 state、event 里做副作用。
3. 这些应用是 **Vite + React SPA（CSR）**，不是 Next.js。禁止抄 skill 示例里的 `next/*`、`'use client'`、`'use server'`、`React.cache()`、`after()`、RSC / Server Actions。

不要在本文件重复 React 细则。细则只维护在 `apps/admin/AGENTS.md`。
