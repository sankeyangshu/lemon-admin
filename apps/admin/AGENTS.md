# admin React 规范

适用于 `apps/` 下的 React 应用（当前 `apps/admin`、`apps/web`）。不覆盖 `packages/web/**`。

本文件是 **强制开发工作流**，不是建议。违反即缺陷，即使功能正常也必须改。

性能类问题同时加载 `vercel-react-best-practices`。**冲突以本文件为准**，覆盖清单见文末。

`apps/` 下的 React 应用是 **Vite + React SPA（CSR）**，不是 Next.js。禁止 `'use client'` / `'use server'`，禁止 import `next/*`，禁止抄 skill 里的 `React.cache()`、`after()`、RSC / Server Actions。

---

## 组件定义

### 必须使用箭头函数

```tsx
// ✅ 正确
const Portal = (props: PortalProps) => { ... };

// ❌ 禁止 function 声明式组件
function Portal(props: PortalProps) { ... }
```

### 必须有独立的 Props 接口

用 `interface`，禁止在函数签名里内联。每个字段必须有 JSDoc 注释说明**意图**（不是重复类型）：

```tsx
interface PortalProps {
  /** 是否在容器不存在时自动创建 */
  autoCreate?: boolean;
  /** 传送门内容 */
  children: ReactNode;
}
```

### Props 在函数体内解构

**禁止**在参数位置解构，解构必须是函数体第一行：

```tsx
// ✅ 正确
const Portal = (props: PortalProps) => {
  const { autoCreate = false, children, container } = props;
  ...
};

// ❌ 禁止
const Portal = ({ autoCreate, children }: PortalProps) => { ... };
```

理由：保持单一可预测的入口、便于调试重构、防止 prop 意外遮蔽。

## Hooks 规则

### `useCallback` — 禁止使用

`useCallback` **不得**出现在组件代码中。以下用法一律禁止：

- 为传给子组件的函数「稳定」引用
- 配合 `React.memo` 阻止子组件重渲染
- 用来消除 `exhaustive-deps` 告警
- 任何预防性 / 防御性优化

若某处看起来「必须」用它，说明**设计有问题**，改设计而不是加 hook：

- 函数不闭包任何东西 → 提到组件外
- 命令式且不应影响渲染 → 改用 `ref`
- 其余 → 重划组件边界，让该函数不再跨界

> Web 端默认启用 React Compiler，手动 memo 多余，且可能干扰编译器。没开 Compiler 禁令同样成立——理由见文末「核心理念」。

### `useMemo` — 仅限两种场景

1. **从逻辑派生值**：memo 结果是一个**值**（不是函数），且逻辑非平凡
2. **高开销计算**：可证明的高开销，非预防性优化

其余场景**禁止**使用。

### `react-hooks/exhaustive-deps`

默认**不允许**禁用。仅当确认理解依赖模型、且行为是有意为之时可禁用，
且必须写在**文件顶部**，禁止行内禁用：

```ts
/* eslint-disable react-hooks/exhaustive-deps */
```

## 组件内部排列顺序

组件内部声明必须按以下顺序排列，不得随意穿插：

| 顺序 | 内容              | 说明                              |
| ---- | ----------------- | --------------------------------- |
| 0    | 常量              | 组件**外部**，与实例无关的纯值    |
| 1    | 路由 / 环境 hooks | 环境上下文，最先获取              |
| 2    | `useState`        | 组件自有状态                      |
| 3    | `useRef`          | 命令式引用                        |
| 4    | 自定义 hooks      | 业务逻辑封装                      |
| 5    | 网络 hooks        | query / mutation                  |
| 6    | 计算变量          | 由以上状态派生                    |
| 7    | 函数声明          | 事件处理、辅助逻辑                |
| 8    | `useEffect`       | 副作用，放在函数之后、return 之前 |
| 9    | `return`          | JSX 渲染                          |

```tsx
const CODE_LENGTH = 6; // 0. 常量在组件外

const UserForm = (props: UserFormProps) => {
  const { title } = props;

  const navigate = useNavigate(); // 1. 环境

  const [value, setValue] = useState(''); // 2. state
  const inputRef = useRef<HTMLInputElement>(null); // 3. ref

  const { count, start } = useCountDownTimer(60); // 4. 自定义 hooks
  const { data: profile } = useMyProfileQuery(); // 5. 网络 hooks
  const { mutate: submit, isPending } = useSubmitMutation();

  const canSubmit = value.length > 0 && !isPending; // 6. 计算变量

  function handleSubmit() { ... } // 7. 函数声明

  useEffect(() => { ... }, []); // 8. 副作用

  return ( ... ); // 9. JSX
};
```

> **原则**：数据流自上而下——先声明数据源，再派生，再处理，最后渲染。
> 后面的可以引用前面的，前面的不应依赖后面的。

### 例外：初始值依赖上游数据

当 `useState` 的初始值需要由 hook / 网络接口的返回值决定时，允许把该 `useState`
下移到数据源之后：

```tsx
const { data: profile } = useMyProfileQuery();
const profilePhone = profile?.phoneNumber ?? '';

// ✅ 初始值依赖 profilePhone，放在数据源之后
const [phone, setPhone] = useState(phoneParam ?? profilePhone);
```

**判断标准**：初始值表达式引用了前面的 hook 返回值或派生变量，则该 state
跟随其依赖的位置，而非固定在第 2 层。

## 内部函数

组件内的辅助函数必须使用 **function 声明**（不是箭头函数）；可复用的应提到组件外：

```tsx
// ✅ function 声明
function findTargetElement() { ... }

// ❌ 禁止箭头函数
const findTargetElement = () => { ... };
```

理由：执行意图清晰、栈追踪更好。

## State vs Ref

| 用途                        | Hook       |
| --------------------------- | ---------- |
| 影响渲染的状态              | `useState` |
| 命令式 / 不触发渲染的可变值 | `useRef`   |

绝不混淆职责。

## useEffect

仅用于：生命周期绑定、外部系统同步、DOM / 命令式集成。

目的必须一读即明；副作用必须局部化；**创建了资源必须有 cleanup**。

## Boolean 条件规则

- 只需判断真值时，一律写 `Boolean(value)`
- 不要仅为得到布尔条件而写 `value !== undefined`、`value != null`
- 仅当 `undefined` 必须与 `0`、空字符串、`false`、`null` 区分开时，才允许显式空值比较

---

## 命名规范

### 文件命名

文件一律 **kebab-case**，禁止 PascalCase 文件名。组件导出仍是 PascalCase，与文件名无关。

| 类型            | 格式                                                                | 示例                                |
| --------------- | ------------------------------------------------------------------- | ----------------------------------- |
| 组件文件        | kebab-case                                                          | `locale-picker.tsx`, `svg-icon.tsx` |
| 目录入口        | 目录 kebab-case + `index.tsx` / `index.ts`                          | `header/index.tsx`                  |
| 测试文件        | kebab-case + `.spec`                                                | `locale-picker.spec.tsx`            |
| Hook 文件       | kebab-case；core 模块主 hook 用 `hook.ts`，独立 hook 用 `use-` 前缀 | `hook.ts`, `use-auth.ts`            |
| 类型文件        | kebab-case                                                          | `type.ts`, `app.d.ts`               |
| 常量 / 工具文件 | kebab-case                                                          | `utils.ts`, `classes.ts`            |

例外：

- Vite 入口：`main.tsx`、`App.tsx`
- TanStack Router 的 `src/pages` 按路由约定：`__root.tsx`、`route.tsx`、`index.tsx`、`_authenticated/`、`(errors)/`

### 导出命名

| 类型        | 格式                  | 示例                               |
| ----------- | --------------------- | ---------------------------------- |
| 组件        | PascalCase            | `Button`, `PasswordInput`          |
| Hook        | camelCase，`use` 前缀 | `useAuth`, `useLoginMutation`      |
| 常量        | UPPER_SNAKE_CASE      | `AUTH_URLS`, `SERVICE_CODES`       |
| 类型 / 接口 | PascalCase            | `AuthTokens`, `LoginParams`        |
| 工具函数    | camelCase             | `createAppRequest`, `getAtomValue` |

### API 相关命名

| 类型          | 规则                   | 示例                              |
| ------------- | ---------------------- | --------------------------------- |
| URL 常量      | `MODULE_URLS`          | `AUTH_URLS`, `MONITOR_CACHE_URLS` |
| Query Keys    | `MODULE_QUERY_KEYS`    | `AUTH_QUERY_KEYS`                 |
| Mutation Keys | `MODULE_MUTATION_KEYS` | `AUTH_MUTATION_KEYS`              |
| Fetch 函数    | `fetchXxx`             | `fetchLogin`, `fetchCaptcha`      |
| Query Hook    | `useXxxQuery`          | `useCacheInfoQuery`               |
| Mutation Hook | `useXxxMutation`       | `useAssignRoleMembersMutation`    |

### API 类型

写在 `declare global` 内、用**点号分段**的 namespace，字段一律 **camelCase**，每个字段必须有注释。后端 snake_case 在 service 层转换，**不要把 snake_case 带进类型定义**。

```ts
declare global {
  namespace Api.Auth {
    /** 账号密码登录 */
    type PwdLoginParams = {
      /** 图形验证码内容 */
      code?: string;
      /** 密码 */
      password: string;
      /** 用户名 */
      userName: string;
    };
  }
}
```

### Core 模块结构

跨页面的能力放 `src/core/<name>/`。

```
src/core/<name>/
├── components/        # 该模块私有组件（需要时才建）
├── hook.ts            # 模块 hook，导出 useXxx
├── provider.tsx       # 需要 Context Provider 时
├── index.ts           # 对外导出
└── types.ts           # 需要时才建
```

hooks 平铺在模块根下，不套 `hooks/` 目录。示例：`src/core/locale/`。

---

## 核心理念

- React **不是**关于「防止 re-render」
- Hooks 是**语义工具**，不是性能 hack
- 可读性 > 过早优化
- **架构错误不能用 hooks 来打补丁**

如果某个 hook 让你觉得「必须要用」，先质疑设计。

---

## 覆盖 `vercel-react-best-practices` 的内容

写 React 时加载该 skill。下面这些 **以本文件为准**，禁止照抄 skill 的「正确示例」。

### 整段覆盖

| Skill 规则                             | 本仓库                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `rerender-memo`                        | 禁止用 `React.memo` / 拆 memo 组件来防重渲染。贵计算先抽组件、loading 先 return；不要包 `memo()`。                            |
| `rerender-memo-with-default-value`     | 不为 `memo()` 服务。默认对象 / 函数仍可提到模块顶层，但不要因此引入 `memo`。                                                  |
| `rerender-functional-setstate`         | **保留** `setX(curr => ...)`。示例里的 `useCallback(..., [])` **禁止**。handler 用组件内 `function` 声明。                    |
| `client-swr-dedup`                     | 不要为了 skill 装 SWR。用本仓库 query 库：`useXxxQuery` / `useXxxMutation`。禁止 `useEffect` + `fetch` 拉列表。               |
| `bundle-dynamic-imports`               | 禁止 `next/dynamic`。重组件用 `React.lazy` + `import()` + `<Suspense>`。                                                      |
| `async-suspense-boundaries`            | 只用于 **代码分割**。不要用 Suspense 模拟 RSC 流式数据。                                                                      |
| `async-api-routes` / 全部 `server-*`   | 前端任务忽略。不要抄 Server Actions、`React.cache()`、`after()`、RSC 序列化。                                                 |
| `rendering-hydration-no-flicker`       | 纯 CSR，忽略。                                                                                                                |
| `rendering-hydration-suppress-warning` | 纯 CSR，忽略。                                                                                                                |
| `rendering-usetransition-loading`      | 本地 UI 过渡可以用 `useTransition`。**请求 Nest 的 loading 用 mutation `isPending`**，禁止 `useTransition` 包 `await fetch`。 |

### 部分覆盖

| Skill 规则                                  | 仍采用                                    | 砍掉                                                                                  |
| ------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `rerender-simple-expression-in-memo`        | 简单 boolean/number/string 不要 `useMemo` | 不要解读成「复杂一点就可以随意 memo」；只允许本文两种场景                             |
| `js-hoist-regexp` / `js-tosorted-immutable` | 模块顶层 hoist、`toSorted()` 不 mutate    | 预防性 `useMemo` 包一层 —— 仅当算「非平凡派生值 / 高开销」才用                        |
| `rerender-no-inline-components`             | 禁止在组件内定义组件                      | 示例里的 `function` 组件声明 —— 本仓库组件必须箭头函数                                |
| skill 里所有组件示例                        | 性能意图                                  | `function Page()`、参数解构、内部 `const handler = () => {}`、`useCallback`、`memo()` |

skill 示例和本文件组件写法冲突时，**抄意图，改写法**：箭头函数组件、体内解构、内部 `function` 声明、不用 `useCallback` / `memo`。

### 不覆盖（按 skill 做）

- 瀑布流：`async-defer-await`、`async-parallel`、`async-dependencies`（用 `Promise.all` + `.then`，不必装 `better-all`）
- Bundle：`bundle-barrel-imports`、`bundle-conditional`、`bundle-preload`、`bundle-defer-third-party`（三方分析用 `import()`，不用 `next/dynamic`）
- 客户端：`client-event-listeners`、`client-passive-event-listeners`、`client-localstorage-schema`
- 重渲染：`rerender-derived-state`、`rerender-derived-state-no-effect`、`rerender-defer-reads`、`rerender-dependencies`、`rerender-lazy-state-init`、`rerender-move-effect-to-event`、`rerender-use-ref-transient-values`、`rerender-transitions`（仅非紧急 UI）
- 渲染：`rendering-animate-svg-wrapper`、`rendering-content-visibility`、`rendering-hoist-jsx`、`rendering-svg-precision`、`rendering-conditional-render`、`rendering-activity`（React 19+ 且已依赖）
- JS 热路径：`js-*`（不要为微优化牺牲可读性）
- `advanced-init-once`、`advanced-event-handler-refs`（handler 放 ref 可以；这不是 `useCallback`）
