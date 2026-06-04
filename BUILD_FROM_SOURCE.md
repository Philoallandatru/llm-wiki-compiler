# 从源代码编译和使用 llm-wiki-compiler

本指南说明如何从源代码构建并使用 llm-wiki-compiler。

## 前置要求

- Node.js >= 24
- npm 或 pnpm

## 步骤 1：克隆仓库

```bash
git clone https://github.com/Philoallandatru/llm-wiki-compiler.git
cd llm-wiki-compiler
```

## 步骤 2：安装依赖

```bash
npm install
```

## 步骤 3：构建项目

```bash
npm run build
```

这会将 TypeScript 源代码编译到 `dist/` 目录。

## 步骤 4：配置环境变量

```bash
# 设置 Anthropic API Key
export ANTHROPIC_API_KEY=sk-ant-...

# 或者使用其他提供商
export LLMWIKI_PROVIDER=openai
export OPENAI_API_KEY=sk-...
```

## 步骤 5：使用编译后的 CLI

有三种方式使用编译后的 CLI：

### 方式 1：直接运行（推荐用于开发）

```bash
node dist/cli.js <command> [options]

# 示例
node dist/cli.js ingest https://example.com/article
node dist/cli.js batch-compile ./documents/ --batch 2
node dist/cli.js compile
node dist/cli.js query "what is X?"
```

### 方式 2：使用 npm link（全局命令）

```bash
# 在项目根目录创建全局链接
npm link

# 现在可以在任何地方使用 llmwiki 命令
llmwiki ingest https://example.com/article
llmwiki batch-compile ./documents/ --batch 2
llmwiki compile
```

### 方式 3：使用 npx（本地执行）

```bash
# 在项目根目录
npx llmwiki <command> [options]

# 示例
npx llmwiki batch-compile ./documents/ --batch 2
```

## 开发模式

如果你正在开发和修改代码，可以使用监听模式：

```bash
# 自动重新编译
npm run dev

# 在另一个终端使用
node dist/cli.js <command>
```

## 常用命令示例

```bash
# 批量处理文件
node dist/cli.js batch-compile ./test-files/ --batch 3

# 注入单个文件
node dist/cli.js ingest ./document.pdf

# 编译 wiki
node dist/cli.js compile

# 查询
node dist/cli.js query "explain the concept"

# 查看 wiki
node dist/cli.js view --open

# 多项目管理
node dist/cli.js project add my-wiki "My Wiki Project"
node dist/cli.js project list
node dist/cli.js project switch my-wiki
```

## 项目结构

```
llm-wiki-compiler/
├── src/                    # TypeScript 源代码
│   ├── cli.ts             # CLI 入口
│   ├── commands/          # 命令实现
│   │   ├── batch-compile.ts
│   │   ├── compile.ts
│   │   ├── ingest.ts
│   │   └── ...
│   ├── compiler/          # 编译器核心
│   ├── mcp/              # MCP 服务器
│   └── utils/            # 工具函数
├── dist/                  # 编译输出（npm run build 生成）
│   └── cli.js            # 编译后的 CLI 入口
├── package.json
└── tsconfig.json
```

## 故障排除

### 问题：命令找不到

**解决方案**：确保已经运行 `npm run build` 并且 `dist/cli.js` 存在。

### 问题：API Key 错误

**解决方案**：检查环境变量是否正确设置：
```bash
echo $ANTHROPIC_API_KEY
```

### 问题：Node 版本过低

**解决方案**：升级到 Node.js 24 或更高版本：
```bash
node --version  # 应该显示 v24.x.x 或更高
```

### 问题：TypeScript 编译错误

**解决方案**：
```bash
# 清理并重新安装
rm -rf node_modules dist
npm install
npm run build
```

## 卸载全局链接

如果使用了 `npm link`，可以这样卸载：

```bash
npm unlink -g llm-wiki-compiler
```

## 更新代码

```bash
# 拉取最新代码
git pull origin main

# 重新安装依赖（如果 package.json 有变化）
npm install

# 重新构建
npm run build
```

## 运行测试

```bash
npm test
```

## 代码健康检查

```bash
npx fallow
```
