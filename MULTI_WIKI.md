# Multi-Wiki Project Support

## 概述

`multi-wiki` 分支添加了对多个独立 Wiki 项目的支持。每个项目有自己的 `sources/`、`wiki/` 和状态文件，实现完全隔离的知识库管理。

## 架构设计

### 目录结构

```
project-root/
├── sources/              # 默认项目（向后兼容）
├── wiki/
│   ├── concepts/
│   └── queries/
├── projects/             # 多项目目录
│   ├── research/
│   │   ├── sources/
│   │   └── wiki/
│   ├── work/
│   │   ├── sources/
│   │   └── wiki/
│   └── personal/
│       ├── sources/
│       └── wiki/
└── .llmwiki/
    ├── state.json        # 默认项目状态
    ├── projects.json     # 项目配置
    └── projects/         # 各项目独立状态
        ├── research/
        │   ├── state.json
        │   ├── embeddings.json
        │   └── candidates/
        ├── work/
        └── personal/
```

### 配置文件

`.llmwiki/projects.json`:
```json
{
  "version": 1,
  "defaultProject": "default",
  "projects": {
    "default": {
      "id": "default",
      "name": "Default",
      "description": "Main wiki project",
      "sourcesDir": "sources",
      "wikiDir": "wiki",
      "createdAt": "2026-05-24T10:00:00Z"
    },
    "research": {
      "id": "research",
      "name": "Research Papers",
      "description": "Academic papers and research notes",
      "sourcesDir": "projects/research/sources",
      "wikiDir": "projects/research/wiki",
      "createdAt": "2026-05-24T11:00:00Z"
    }
  }
}
```

## 使用方法

### 项目管理命令

#### 创建新项目
```bash
llmwiki project add <id> <name> [-d <description>]

# 示例
llmwiki project add research "Research Papers" -d "Academic papers and notes"
llmwiki project add work "Work Docs"
```

#### 列出所有项目
```bash
llmwiki project list

# 输出示例：
# Wiki Projects:
#
# → Default (default)
#   Main wiki project
#   Sources: sources
#   Wiki:    wiki
#   [ACTIVE]
#
#   Research Papers (research)
#   Academic papers and research notes
#   Sources: projects/research/sources
#   Wiki:    projects/research/wiki
```

#### 切换活动项目
```bash
llmwiki project switch <id>

# 示例
llmwiki project switch research
```

#### 查看项目详情
```bash
llmwiki project show <id>

# 示例
llmwiki project show research
```

#### 删除项目
```bash
llmwiki project remove <id>

# 注意：只删除配置，不删除文件（安全措施）
llmwiki project remove old-project
```

### 在命令中使用项目（计划中）

未来版本将支持 `--project` 参数：

```bash
# 使用默认项目
llmwiki compile
llmwiki ingest https://example.com

# 使用指定项目
llmwiki compile --project research
llmwiki ingest https://example.com --project work
llmwiki query "question" --project research
```

## 实现状态

### ✅ 已完成

1. **项目配置系统** (`src/utils/project-config.ts`)
   - 读写 `.llmwiki/projects.json`
   - 项目 CRUD 操作
   - 路径解析逻辑

2. **项目管理命令** (`src/commands/project.ts`)
   - `project add` - 创建新项目
   - `project list` - 列出所有项目
   - `project switch` - 切换活动项目
   - `project remove` - 删除项目配置
   - `project show` - 查看项目详情

3. **CLI 集成** (`src/cli.ts`)
   - 注册 `project` 命令组
   - 完整的帮助文档

4. **项目解析器** (`src/utils/project-resolver.ts`)
   - `resolveProject()` - 解析项目配置
   - `createProjectContext()` - 创建项目上下文

### 🚧 待实现

1. **现有命令的多项目支持**
   - 为 `compile`、`ingest`、`query`、`watch`、`lint`、`export`、`view` 添加 `--project` 参数
   - 更新命令实现以使用 `ProjectContext`

2. **路径重构**
   - 将硬编码的 `SOURCES_DIR`、`WIKI_DIR` 等替换为动态路径
   - 更新编译器、查询器、导出器等使用项目路径

3. **状态管理**
   - 更新 `state.ts` 以支持项目特定的状态文件
   - 更新 `embeddings.ts` 以支持项目特定的嵌入文件

4. **MCP 服务器支持**
   - 为 MCP 工具添加项目参数
   - 更新资源 URI 以支持项目命名空间

5. **测试**
   - 为多项目功能添加单元测试
   - 添加集成测试验证项目隔离

## 向后兼容性

- **完全向后兼容**：不使用 `--project` 参数时，所有命令使用默认项目（`sources/` 和 `wiki/`）
- **无需迁移**：现有项目无需任何修改即可继续工作
- **渐进式采用**：用户可以选择性地创建新项目，不影响现有工作流

## 设计决策

### 为什么选择命名项目而不是命名空间？

1. **完全隔离**：每个项目有独立的状态、嵌入、候选队列
2. **灵活性**：项目可以有不同的 schema 配置
3. **清晰性**：目录结构明确，易于理解和管理
4. **安全性**：删除项目不会意外影响其他项目

### 为什么不自动删除项目文件？

安全第一。`project remove` 只删除配置，保留文件。用户需要手动删除 `projects/<id>/` 目录，避免意外数据丢失。

## 下一步

1. 实现 `--project` 参数支持（任务 #5）
2. 重构路径解析逻辑（任务 #3）
3. 添加测试覆盖
4. 更新文档和示例

## 示例工作流

```bash
# 1. 创建研究项目
llmwiki project add research "Research Papers"

# 2. 切换到研究项目
llmwiki project switch research

# 3. 摄取研究资料
llmwiki ingest https://arxiv.org/paper.pdf

# 4. 编译
llmwiki compile

# 5. 查询
llmwiki query "What is the main contribution?"

# 6. 切换回默认项目
llmwiki project switch default

# 7. 继续使用默认项目
llmwiki compile
```

## 技术细节

### 路径解析

`resolveProjectPaths()` 函数返回项目的所有路径：

```typescript
interface ProjectPaths {
  sourcesDir: string;
  wikiDir: string;
  conceptsDir: string;
  queriesDir: string;
  stateFile: string;
  embeddingsFile: string;
  indexFile: string;
  mocFile: string;
  candidatesDir: string;
  candidatesArchiveDir: string;
  lastLintFile: string;
}
```

### 项目上下文

命令通过 `ProjectContext` 访问项目信息：

```typescript
interface ProjectContext {
  root: string;
  project: ProjectConfig;
  paths: ProjectPaths;
}
```

## 贡献

欢迎贡献！当前需要帮助的领域：

1. 为现有命令添加 `--project` 支持
2. 编写测试
3. 更新文档
4. 报告 bug 和提出改进建议
