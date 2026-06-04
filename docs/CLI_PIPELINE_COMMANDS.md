# llmwiki CLI Pipeline Commands

本页整理从导入、编译、审核到查询的 pipeline 命令。更多工具命令见 [CLI utility commands](CLI_UTILITY_COMMANDS.md)，总览见 [CLI reference](CLI_REFERENCE.md)。

## `ingest`

把 URL 或本地文件导入到 `sources/`，并写成带 frontmatter 的 markdown 源文件。

```bash
llmwiki ingest <source> [options]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `<source>` | 是 | URL、本地文件路径、PDF、图片、字幕/转写文件或 YouTube URL。 |
| `-p, --project <id>` | 否 | 导入到指定项目。未设置时使用当前 active project。 |

支持的来源类型：

| 类型 | 识别方式 | 行为 |
| --- | --- | --- |
| Web 页面 | `http://` 或 `https://` URL | 抓取网页正文并转为 markdown。 |
| YouTube 转写 | `youtube.com/watch` 或 `youtu.be` URL | 抓取可用 transcript。 |
| PDF | `.pdf` | 提取 PDF 文本和标题。 |
| 图片 | `.jpg`、`.jpeg`、`.png`、`.gif`、`.webp` | 使用 Anthropic vision 做 OCR 和图片描述。 |
| 字幕/转写 | `.vtt`、`.srt` | 保留时间戳与说话内容。 |
| TXT 转写 | `.txt` 且检测到多人 speaker 或密集时间戳 | 作为转写导入。 |
| 普通文件 | 其他本地文件，或未命中转写规则的 `.txt` | 读取文件文本内容。 |

```bash
llmwiki ingest https://example.com/article
llmwiki ingest ./papers/spec.pdf
llmwiki ingest ./meeting.vtt
llmwiki ingest ./diagram.png
llmwiki ingest ./notes.txt --project storage
```

注意事项：

- 单个源内容超过 `100000` 字符会被截断并写入 `truncated` 元数据。
- 内容少于 `50` 个非空字符会给出警告；空内容会失败。
- 图片导入当前要求 `LLMWIKI_PROVIDER=anthropic`，并配置 Anthropic 凭证。

## `ingest-session`

导入 coding-agent session export，支持单个文件或目录批量导入。

```bash
llmwiki ingest-session <path>
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `<path>` | 是 | Claude、Codex 或 Cursor session export 文件；也可以是包含 session 文件的目录。 |

```bash
llmwiki ingest-session ./session.jsonl
llmwiki ingest-session ./agent-sessions/
```

行为：

- 单文件模式：识别并导入该 session。
- 目录模式：扫描目录内文件，能识别的导入，不能识别的跳过并警告。
- 如果目录中没有任何 session 成功导入，命令会失败。

## `compile`

把 `sources/` 编译成 interlinked wiki 页面。

```bash
llmwiki compile [options]
```

| 参数 | 说明 |
| --- | --- |
| `--review` | 把生成结果写入 `.llmwiki/candidates/` 作为候选页，不直接修改 `wiki/`。删除源文件导致的 orphan 标记会延后到下一次非 review compile。 |
| `--lang <code>` | 指定生成 wiki 内容的目标语言，例如 `Chinese`、`ja`、`zh-CN`。等价于本次运行设置 `LLMWIKI_OUTPUT_LANG`。 |
| `-p, --project <id>` | 编译指定项目。未设置时使用 active project。 |

```bash
llmwiki compile
llmwiki compile --lang Chinese
llmwiki compile --review
llmwiki compile --project nvme-wiki
```

注意事项：

- `compile` 会做增量编译，只处理新增或变更的 source。
- 会获取 `.llmwiki/lock`，避免多个编译流程同时写 wiki。
- 如果没有找到 sources 目录，会提示先运行 `llmwiki ingest <url>`。
- 非 review 模式会更新 `wiki/concepts/`、`wiki/index.md`、`wiki/MOC.md` 和 embeddings。

## `batch-compile`

从目录批量导入文件，并在每个 batch 后运行 compile。

```bash
llmwiki batch-compile <folder> [options]
```

| 参数 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `<folder>` | 是 | - | 要批量导入的目录。 |
| `-b, --batch <number>` | 否 | `2` | 每批导入多少个文件。 |
| `-p, --project <id>` | 否 | active project | 目标项目。 |

```bash
llmwiki batch-compile ./documents
llmwiki batch-compile ./documents --batch 4
llmwiki batch-compile ./documents --batch 2 --project storage
```

行为：

- 目录必须存在且包含文件。
- 每个文件单独导入；失败文件会被跳过并显示原因。
- 如果某个 batch 没有任何文件导入成功，该 batch 会跳过 compile。
- 如果所有文件都导入失败，命令最终失败。

## `review`

管理 `compile --review` 产生的候选页。

```bash
llmwiki review <subcommand>
```

| 命令 | 参数 | 说明 |
| --- | --- | --- |
| `llmwiki review list` | 无 | 列出待审核候选页。 |
| `llmwiki review show <id>` | `<id>` 必填 | 打印候选页元数据、正文、schema/provenance violation。 |
| `llmwiki review approve <id>` | `<id>` 必填 | 批准候选页，写入 `wiki/concepts/<slug>.md`。 |
| `llmwiki review reject <id>` | `<id>` 必填 | 拒绝候选页，移动到 `.llmwiki/candidates/archive/`。 |

批准 candidate 后会刷新 wikilinks、`wiki/index.md`、`wiki/MOC.md`，并尝试更新 embeddings。批准和拒绝都会使用 `.llmwiki/lock`，避免与 compile 或其他 review 操作并发写入。

## `query`

基于已编译 wiki 回答问题。

```bash
llmwiki query <question> [options]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `<question>` | 是 | 自然语言问题。建议用引号包裹。 |
| `--save` | 否 | 把回答保存为 `wiki/queries/<slug>.md`，并立即重建 index。 |
| `--debug` | 否 | 打印检索到的页面、chunk、分数和 rerank 信息。 |
| `--lang <code>` | 否 | 指定回答语言，例如 `Chinese`、`ja`、`zh-CN`。 |

```bash
llmwiki query "What are the main concepts?"
llmwiki query "这份规范里的关键限制是什么？" --lang Chinese
llmwiki query "Summarize the risk areas" --save
llmwiki query "Why is this concept important?" --debug
```

注意事项：

- 需要先运行 `llmwiki compile`，确保存在 `wiki/index.md`。
- `query` 先做相关页面/片段选择，再把选中的 wiki 内容交给 LLM 生成答案。
- 当 `--save` 成功时，保存的回答会参与后续查询检索。
- 当前 CLI 没有 `--project` 参数；它读取当前工作目录下的 `wiki/`。

## `watch`

监听 `sources/` 变化并自动重新编译。

```bash
llmwiki watch
```

行为：

- 监听新增、修改、删除事件。
- 变化触发后会 debounce `500ms`，避免短时间多次编译。
- 如果编译正在运行，新变化会排队，当前编译结束后再跑一次。
- 当前 CLI 没有 `--project` 参数；监听根目录 `sources/`。

## `lint`

运行规则型 wiki 质量检查。

```bash
llmwiki lint
```

行为：

- 检查 broken links、orphans、空页面、低置信度、引用/provenance/schema 等问题。
- 读取当前 schema 配置；没有 schema 文件时使用默认 schema。
- 把结果缓存到 `.llmwiki/last-lint.json`，供 viewer health 面板读取。
- 如果存在 error 级别问题，进程退出码为 `1`。
