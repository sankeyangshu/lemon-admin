/**
 * 提交规范
 * feat:     新增功能
 * fix:      修复 bug
 * docs:     文档变更
 * style:    代码格式（不影响功能，例如空格、分号等格式修正）
 * refactor: 代码重构（不包括 bug 修复、功能新增）
 * perf:     性能优化
 * test:     添加、修改测试用例
 * build:    构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
 * ci:       修改 CI 配置、脚本
 * chore:    对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
 * revert:   回滚 commit
 */
export default { extends: ['@commitlint/config-conventional'] };
