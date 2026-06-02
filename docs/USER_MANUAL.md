# llmwiki 用户使用手册

这份手册面向第一次使用 `llmwiki` 的用户，按真实工作流说明每个命令该怎么用、什么时候用、用完会看到什么结果。完整参数表见 [CLI reference](CLI_REFERENCE.md)。

## llmwiki 是什么

`llmwiki` 是一个知识编译 CLI：你把网页、PDF、笔记、字幕、图片或 agent 会话记录导入进去，它会把原始材料编译成一个互相链接的 markdown wiki。之后你可以浏览 wiki、对 wiki 提问、保存答案，并让后续问题继续利用这些沉淀内容。

核心流程是：

```text
导入资料 -> 编译 wiki -> 提问/浏览 -> 保存答案 -> wiki 变得更完整
```

## 安装与准备

全局安装：

```bash
npm install -g llm-wiki-compiler
llmwiki --version
```

也可以在项目里直接用：

```bash
npx llmwiki --help
```

推荐在一个专门的资料项目目录里运行：

```bash
mkdir my-knowledge-wiki
cd my-knowledge-wiki
```

## 配置 LLM provider

默认 provider 是 Anthropic。最简单的配置方式：

```bash
export ANTHROPIC_API_KEY=sk-...
```

如果你想用 OpenAI：

```bash
export LLMWIKI_PROVIDER=openai
export OPENAI_API_KEY=sk-...
```

如果你想用本地 Ollama：

```bash
export LLMWIKI_PROVIDER=ollama
export LLMWIKI_MODEL=llama3.1
export OLLAMA_HOST=http://localhost:11434/v1
```

常见提醒：

- `compile`、`query`、`batch-compile`、`watch` 需要可用的 LLM provider。
- `ingest` 普通文本、PDF、字幕一般不需要 LLM provider。
- 图片导入需要 Anthropic vision，所以要使用 Anthropic provider。
- 如果使用 Anthropic 做语义检索，还需要 `VOYAGE_API_KEY`；缺少时会退回普通检索或给出警告。

## 第一次使用：最短路径

导入一个资料源：

```bash
llmwiki ingest https://example.com/article
```

导入后会生成 `sources/*.md`。接着运行：

```bash
llmwiki compile
```

编译后会生成 `wiki/concepts/`、`wiki/index.md`、`wiki/MOC.md` 和 `.llmwiki/` 状态文件。

然后提问：

```bash
llmwiki query "这份资料讲了哪些关键概念？"
```

如果觉得答案有复用价值，可以保存：

```bash
llmwiki query "这份资料讲了哪些关键概念？" --save
```

保存的答案会写入 `wiki/queries/`，以后查询也会参考它。

## 导入资料

导入网页：

```bash
llmwiki ingest https://example.com/article
```

导入本地文件：

```bash
llmwiki ingest ./notes.md
llmwiki ingest ./spec.pdf
llmwiki ingest ./meeting.vtt
```

导入图片：

```bash
llmwiki ingest ./diagram.png
```

导入 agent 会话：

```bash
llmwiki ingest-session ./session.jsonl
llmwiki ingest-session ./sessions/
```

导入多个文件并分批编译：

```bash
llmwiki batch-compile ./documents --batch 5
```

什么时候用 `batch-compile`：

- 你有一整个目录的资料要导入。
- 你希望每批资料编译后，后续批次能利用前面生成的概念。
- 你想避免一次性把大量材料都压进同一轮编译。

## 编译 wiki

普通编译：

```bash
llmwiki compile
```

指定输出语言：

```bash
llmwiki compile --lang Chinese
llmwiki compile --lang zh-CN
```

先审核再落库：

```bash
llmwiki compile --review
```

`--review` 会把生成页放到 `.llmwiki/candidates/`，不会直接修改 `wiki/`。适合重要资料、团队协作或你想先检查 LLM 输出的场景。

## 审核候选页

列出候选页：

```bash
llmwiki review list
```

查看某个候选页：

```bash
llmwiki review show <id>
```

批准：

```bash
llmwiki review approve <id>
```

拒绝：

```bash
llmwiki review reject <id>
```

建议流程：

```bash
llmwiki compile --review
llmwiki review list
llmwiki review show <id>
llmwiki review approve <id>
```

如果候选页质量不好，直接 reject；它会被归档，不会污染正式 wiki。

## 对 wiki 提问

基础提问：

```bash
llmwiki query "PCIe 5.0 和 PCIe 4.0 的主要变化是什么？"
```

指定回答语言：

```bash
llmwiki query "summarize the important ideas" --lang Chinese
```

保存答案：

```bash
llmwiki query "这批材料中最值得复习的问题有哪些？" --save
```

查看检索细节：

```bash
llmwiki query "为什么这个机制重要？" --debug
```

`--debug` 适合排查“为什么回答没引用我期待的页面”。它会显示选中的页面、chunk 和分数。

## 浏览 wiki

启动本地只读 viewer：

```bash
llmwiki view
```

启动后会打印类似：

```text
Viewer ready at http://127.0.0.1:12345
```

自动打开浏览器：

```bash
llmwiki view --open
```

指定端口：

```bash
llmwiki view --port 3000
```

在局域网指定地址上访问：

```bash
llmwiki view --host 192.168.1.10 --allow-lan
```

安全提醒：

- 默认只监听 `127.0.0.1`。
- `--host` 和 `--allow-lan` 必须同时使用。
- 不支持 `0.0.0.0`、`::`、`*` 这类 wildcard host。

## 导出 wiki

导出所有格式：

```bash
llmwiki export
```

只导出 JSON：

```bash
llmwiki export --target json
```

导出 Marp 幻灯片：

```bash
llmwiki export --target marp --source concepts
```

输出位置是 `dist/exports/`。支持：

- `llms-txt`
- `llms-full-txt`
- `json`
- `json-ld`
- `graphml`
- `marp`

## 多项目管理

如果你想在一个仓库里维护多个独立 wiki，可以创建项目：

```bash
llmwiki project add nvme-wiki "NVMe Wiki" --description "NVMe and SSD notes"
llmwiki project add pci-wiki "PCI Wiki"
```

查看项目：

```bash
llmwiki project list
```

切换默认项目：

```bash
llmwiki project switch nvme-wiki
```

对指定项目运行命令：

```bash
llmwiki ingest ./spec.pdf --project nvme-wiki
llmwiki compile --project nvme-wiki
llmwiki view --project nvme-wiki
```

查看所有项目：

```bash
llmwiki view --all
```

注意：`project remove <id>` 只从配置移除项目，不删除目录和文件。

## 质量检查

运行 lint：

```bash
llmwiki lint
```

它会检查 wiki 质量，并把结果写入 `.llmwiki/last-lint.json`。viewer 会读取这个缓存显示健康状态。

如果 lint 返回 error，命令退出码会是 `1`，适合放进 CI。

## 自动监听

开发或持续整理资料时可以用：

```bash
llmwiki watch
```

它会监听 `sources/` 的新增、修改、删除，并自动重新编译。按 `Ctrl+C` 停止。

## MCP server

如果你想让 AI agent 使用 llmwiki，可以启动 MCP server：

```bash
llmwiki serve --root /path/to/wiki-project
llmwiki serve --root /path/to/wiki-project --project nvme-wiki
```

`serve` 通过 stdio 工作，通常配置给 Claude Desktop、Cursor 或其他 MCP client 使用。

## 常见问题

`compile` 提示缺少 API key：

设置对应 provider 的环境变量，例如 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY`、`MINIMAX_API_KEY` 或 `GITHUB_TOKEN`。

`query` 提示找不到 wiki index：

```bash
llmwiki compile
```

先运行编译，确保 `wiki/index.md` 已生成。

图片导入失败：

确认当前 provider 是 Anthropic，并设置了 `ANTHROPIC_API_KEY` 或 `ANTHROPIC_AUTH_TOKEN`。

viewer 无法绑定局域网地址：

确认同时传了 `--host` 和 `--allow-lan`，并且没有使用 `0.0.0.0`。

导出的文件在哪里：

查看 `dist/exports/`。

想避免 LLM 输出直接写进 wiki：

```bash
llmwiki compile --review
```

然后通过 `llmwiki review approve <id>` 手动批准。
