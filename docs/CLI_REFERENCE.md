# llmwiki CLI 命令与参数参考

这份文档索引当前代码中已经注册的全部 `llmwiki` CLI 命令、位置参数、选项参数、默认行为和常见用法。命令定义以 `src/cli.ts` 以及 `src/commands/` 下各命令实现为准。

详细命令分为两部分：

- [CLI pipeline commands](CLI_PIPELINE_COMMANDS.md)：`ingest`、`ingest-session`、`compile`、`batch-compile`、`review`、`query`、`watch`、`lint`。
- [CLI utility commands](CLI_UTILITY_COMMANDS.md)：`schema`、`export`、`view`、`serve`、`project`，以及多项目参数支持一览。

## 基本用法

```bash
llmwiki [command] [arguments] [options]
npx llmwiki [command] [arguments] [options]
```

全局可用参数：

| 参数 | 说明 |
| --- | --- |
| `-h, --help` | 查看主命令或子命令帮助。 |
| `-V, --version` | 输出当前 `llm-wiki-compiler` 版本。 |

常见工作流：

```bash
llmwiki ingest ./sources/example.pdf
llmwiki compile --lang Chinese
llmwiki query "这批资料里最重要的概念是什么？" --save
llmwiki view --open
```

## Provider 与环境变量

需要 LLM 的命令会先检查 provider 凭证，包括 `compile`、`batch-compile`、`query`、`watch`。`serve` 会把凭证检查延后到 MCP 工具内部；普通 `ingest` 不做统一凭证检查，但图片导入会调用 Anthropic vision。

| 环境变量 | 说明 |
| --- | --- |
| `LLMWIKI_PROVIDER` | LLM provider。默认 `anthropic`。支持 `anthropic`、`openai`、`ollama`、`minimax`、`copilot`。 |
| `LLMWIKI_MODEL` | 覆盖 provider 默认模型。 |
| `LLMWIKI_OUTPUT_LANG` | 生成内容的目标语言，作用于 `compile` 和 `query`。命令行 `--lang` 优先级更高。 |
| `LLMWIKI_PROMPT_BUDGET_CHARS` | 单个概念生成时可放入 prompt 的源内容字符上限。默认 `200000`。 |
| `LLMWIKI_REQUEST_TIMEOUT_MS` | OpenAI/Ollama 请求超时，单位毫秒。 |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` | Anthropic provider 凭证，二选一。 |
| `ANTHROPIC_BASE_URL` | Anthropic 兼容代理地址。 |
| `OPENAI_API_KEY` | OpenAI provider 凭证；本地兼容服务也需要传一个值。 |
| `OPENAI_BASE_URL` | OpenAI 兼容 chat/tool endpoint。自定义地址通常需要包含 `/v1`。 |
| `OPENAI_EMBEDDINGS_BASE_URL` | OpenAI 兼容 embeddings endpoint；不设置则复用 `OPENAI_BASE_URL`。 |
| `LLMWIKI_EMBEDDING_MODEL` | 覆盖 embeddings 模型。 |
| `OLLAMA_HOST` | Ollama OpenAI-compatible endpoint，默认 `http://localhost:11434/v1`。 |
| `OLLAMA_EMBEDDINGS_HOST` | Ollama embeddings endpoint；不设置则复用 `OLLAMA_HOST`。 |
| `OLLAMA_TIMEOUT_MS` | Ollama 专用超时，优先于 `LLMWIKI_REQUEST_TIMEOUT_MS`。 |
| `MINIMAX_API_KEY` | MiniMax provider 凭证。 |
| `GITHUB_TOKEN` | GitHub Copilot provider 凭证，需要带 `copilot` scope 的 OAuth token。 |
| `VOYAGE_API_KEY` | Anthropic provider 下的语义检索 embeddings 使用 Voyage，需要此变量。 |
| `LLMWIKI_CLAUDE_SETTINGS_PATH` | 指定 Claude settings fallback 文件路径。默认读取 `~/.claude/settings.json`。 |

默认模型：

| Provider | 默认模型 |
| --- | --- |
| `anthropic` | `claude-sonnet-4-20250514` |
| `openai` | `gpt-4o` |
| `ollama` | `llama3.1` |
| `minimax` | `MiniMax-M2.7` |
| `copilot` | `gpt-4o` |

## 命令速查

| 命令 | 用途 |
| --- | --- |
| `llmwiki ingest <source>` | 导入单个 URL 或本地文件。 |
| `llmwiki ingest-session <path>` | 导入 Claude/Codex/Cursor session export。 |
| `llmwiki compile` | 编译 sources 为 wiki。 |
| `llmwiki batch-compile <folder>` | 批量导入目录文件并分批编译。 |
| `llmwiki review list` | 列出 review candidates。 |
| `llmwiki review show <id>` | 查看 candidate。 |
| `llmwiki review approve <id>` | 批准 candidate，写入 wiki。 |
| `llmwiki review reject <id>` | 拒绝 candidate，归档不写 wiki。 |
| `llmwiki query <question>` | 对 wiki 提问。 |
| `llmwiki watch` | 监听 sources 并自动编译。 |
| `llmwiki lint` | 检查 wiki 质量。 |
| `llmwiki schema init` | 初始化 schema 文件。 |
| `llmwiki schema show` | 查看解析后的 schema。 |
| `llmwiki export` | 导出 wiki。 |
| `llmwiki view` | 启动只读 web viewer。 |
| `llmwiki serve` | 启动 MCP server。 |
| `llmwiki project add <id> <name>` | 新增项目。 |
| `llmwiki project list` | 列出项目。 |
| `llmwiki project switch <id>` | 切换 active project。 |
| `llmwiki project remove <id>` | 从配置移除项目。 |
| `llmwiki project show <id>` | 查看项目详情。 |

## 入口命令示例

```bash
llmwiki --help
llmwiki compile --help
llmwiki review --help
llmwiki project --help
```
