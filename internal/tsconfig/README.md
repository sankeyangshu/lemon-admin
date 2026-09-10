# @lemon/tsconfig

> 共享的 TypeScript 配置

## 📦 包信息

- **包名**: `@lemon/tsconfig`
- **版本**: `1.0.0`
- **平台**: Universal
- **职责**: 提供统一的 TypeScript 编译配置

## 🎯 配置文件说明

### base.json - 基础配置

所有配置的基础，包含严格的类型检查规则：

- `strict: true` - 启用所有严格类型检查
- `noEmit: true` - tsc 不输出 JS 文件
- `verbatimModuleSyntax: true` - 严格的模块语法
- `isolatedModules: true` - 支持单文件编译

### lib.json - 库包配置

用于 `packages/` 下需要生成类型声明的库包：

```json
{
  "extends": "@lemon/tsconfig/lib.json"
}
```

特点：

- 生成类型声明文件 (`.d.ts`)
- 仅输出类型，不编译代码（JS 由打包器处理）
- 不包含 DOM 类型

### node.json - Node 包配置

用于 Nest 及 `internal/` 下的 Node.js 工具包：

```json
{
  "extends": "@lemon/tsconfig/node.json"
}
```

特点：

- 包含 Node.js 类型定义
- 使用 `nodenext` 模块解析策略
- 启用实验性装饰器
- 不包含 DOM 相关类型

### web.json - Web 包配置

用于 Web 应用（`apps/admin`、`apps/web`）和 UI 包（`packages/ui`）：

```json
{
  "extends": "@lemon/tsconfig/web.json"
}
```

特点：

- 包含 DOM 类型库
- JSX 使用 `react-jsx` 模式
- 使用 `bundler` 模块解析策略
- 支持 TypeScript 扩展名导入

## 📐 使用示例

### 1. 库包使用

```json
// packages/xxx/tsconfig.json
{
  "extends": "@lemon/tsconfig/lib.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts"]
}
```

### 2. Web 包使用

```json
// packages/ui/tsconfig.json
{
  "extends": "@lemon/tsconfig/web.json",
  "include": ["src/**/*"]
}
```

### 3. Web 应用使用

```json
// apps/admin/tsconfig.app.json
{
  "extends": "@lemon/tsconfig/web.json",
  "compilerOptions": {
    "types": ["vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

### 4. Node 工具包使用

```json
// apps/server/tsconfig.json
{
  "extends": "@lemon/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

## 🎨 配置选择决策树

```
是否是 Node.js 工具 / Nest？
├─ 是 → node.json
└─ 否 → 是否生成类型声明？
    ├─ 是 → lib.json
    └─ 否 → web.json
```

## 🔧 编译器选项说明

### 严格模式选项

- `strict: true` - 启用所有严格检查
- `noImplicitOverride: true` - 覆盖基类方法必须写 `override`
- `noUncheckedIndexedAccess: false` - 索引访问不加 `| undefined`
- `exactOptionalPropertyTypes: false` - 可选属性仍允许显式 `undefined`

### 模块选项

- `target` / `module`: `"ESNext"` - 不降级语法，由打包器处理兼容
- `moduleResolution: "bundler"` - 按 Vite / esbuild 规则解析（`node.json` 为 `nodenext`）
- `moduleDetection: "force"` - 每个文件都当模块
- `isolatedModules: true` - 支持 esbuild / swc 单文件转译
- `verbatimModuleSyntax: true` - 类型导入必须 `import type`

### 输出选项

- `noEmit: true` - 不输出 JS 文件（基础配置）
- `emitDeclarationOnly: true` - 只生成 `.d.ts` 文件（库配置）
- `declarationMap: true` - 生成 `.d.ts.map`，方便跳转到源码（库配置）

### 代码质量选项

- `noUnusedLocals: true` - 检查未使用的局部变量
- `noUnusedParameters: true` - 检查未使用的参数
- `noFallthroughCasesInSwitch: true` - switch 语句必须有 break
- `forceConsistentCasingInFileNames: true` - import 路径大小写必须和磁盘一致
- `skipLibCheck: true` - 跳过 `node_modules` 里的 `.d.ts` 检查

## 🔄 迁移步骤

### 1. 安装依赖

在使用方的 `package.json` 中添加：

```json
{
  "devDependencies": {
    "@lemon/tsconfig": "workspace:*"
  }
}
```

根目录的 `pnpm-workspace.yaml` 中确保包含 `internal/*`：

```yaml
packages:
  - apps/*
  - packages/*
  - internal/*
```

### 2. 更新现有包

替换每个包的 `tsconfig.json`：

```bash
# 库包
echo '{"extends": "@lemon/tsconfig/lib.json", "include": ["src/**/*"]}' > packages/xxx/tsconfig.json

# Web 应用
echo '{"extends": "@lemon/tsconfig/web.json", "include": ["src/**/*"]}' > apps/admin/tsconfig.app.json
```

### 3. 配置路径别名

在应用级别添加 paths 配置：

```json
{
  "extends": "@lemon/tsconfig/web.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📝 维护指南

### 何时修改 base.json

- 需要调整全局严格性规则
- 需要添加全局编译器选项
- TypeScript 版本升级后的配置调整

### 何时添加新配置

- 新的平台支持
- 新的构建工具支持
- 特定场景的定制需求

### 版本管理

此包为 workspace 私有包，不单独发布：

- 小调整：直接修改
- 大调整：同步更新所有使用方

## 🔗 相关文档

- [TypeScript 官方文档](https://www.typescriptlang.org/tsconfig)
- [Vite TypeScript 配置](https://vitejs.dev/guide/features.html#typescript)
