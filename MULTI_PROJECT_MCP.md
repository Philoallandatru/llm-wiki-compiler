# 多项目 MCP 服务器

## 功能概述

llmwiki 现在支持为不同项目启动独立的 MCP 服务器实例。每个 MCP 服务器可以绑定到特定项目，所有工具操作都会使用该项目的目录。

## 使用方法

### 启动绑定到特定项目的 MCP 服务器

```bash
# 为 nvme-wiki 项目启动 MCP 服务器
llmwiki serve --project nvme-wiki

# 为 pci-wiki 项目启动 MCP 服务器
llmwiki serve --project pci-wiki
```

### 启动使用活动项目的 MCP 服务器

```bash
# 使用当前活动项目（defaultProject）
llmwiki serve
```

## MCP 工具行为

当 MCP 服务器绑定到特定项目时，所有工具都会使用该项目的目录：

### 已适配多项目的工具

1. **ingest_source** - 将文档导入到指定项目的 sources 目录
2. **compile_wiki** - 编译指定项目的 wiki
3. **search_pages** - 在指定项目的 wiki 中搜索
4. **read_page** - 从指定项目读取页面
5. **wiki_status** - 显示指定项目的状态

### 暂未完全适配的工具

以下工具目前使用活动项目（defaultProject），因为完全适配需要大规模重构：

1. **query_wiki** - 查询 wiki（使用活动项目）
2. **lint_wiki** - 检查 wiki 质量（使用活动项目）

## 实现细节

### 项目路径解析

每个工具在执行时会：

1. 检查是否指定了 `projectId`
2. 如果指定，使用 `getProjectById(root, projectId)` 获取项目配置
3. 如果未指定，使用 `getActiveProject(root)` 获取活动项目
4. 使用 `resolveProjectPaths(root, project)` 解析项目路径
5. 使用解析后的路径执行操作

### 代码示例

```typescript
// 在 MCP 工具中
const { getActiveProject, getProjectById, resolveProjectPaths } = await import("../utils/project-config.js");
const project = projectId
  ? await getProjectById(root, projectId)
  : await getActiveProject(root);
const paths = resolveProjectPaths(root, project);

// 使用项目路径
const result = await ingestSource(source, paths.sourcesDir);
```

## 配置示例

在 Claude Desktop 或其他 MCP 客户端中配置多个服务器：

```json
{
  "mcpServers": {
    "llmwiki-nvme": {
      "command": "llmwiki",
      "args": ["serve", "--project", "nvme-wiki"]
    },
    "llmwiki-pci": {
      "command": "llmwiki",
      "args": ["serve", "--project", "pci-wiki"]
    }
  }
}
```

## 测试验证

已验证的功能：

- ✅ CLI 选项 `--project <id>` 正确添加
- ✅ MCP 服务器接口支持 `projectId` 参数
- ✅ 所有工具注册函数接受 `projectId` 参数
- ✅ `ingest_source` 工具使用正确的项目目录
- ✅ `compile_wiki` 工具传递正确的 projectId
- ✅ `search_pages` 工具使用正确的项目目录
- ✅ `read_page` 工具使用正确的项目目录
- ✅ `wiki_status` 工具显示正确的项目状态
- ✅ TypeScript 编译通过
- ✅ 项目构建成功

## 未来改进

1. 完全适配 `query_wiki` 工具以支持项目绑定
2. 完全适配 `lint_wiki` 工具以支持项目绑定
3. 添加集成测试验证多服务器并发运行
4. 添加项目切换通知机制
