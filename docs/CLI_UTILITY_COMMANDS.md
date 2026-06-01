# llmwiki CLI Utility Commands

本页整理 schema、export、viewer、MCP server 和多项目管理命令。导入、编译、查询等 pipeline 命令见 [CLI pipeline commands](CLI_PIPELINE_COMMANDS.md)，总览见 [CLI reference](CLI_REFERENCE.md)。

## `schema`

查看或初始化 wiki schema。

```bash
llmwiki schema <subcommand>
```

| 命令 | 说明 |
| --- | --- |
| `llmwiki schema init` | 写入默认 schema 文件到 `.llmwiki/schema.json`。如果文件已存在，不覆盖，只打印警告。 |
| `llmwiki schema show` | 打印当前项目解析后的 schema。 |

schema 加载顺序支持 `.llmwiki/schema.json`、`.llmwiki/schema.yaml`、`.llmwiki/schema.yml`，没有文件时使用默认 schema。

## `export`

把已编译 wiki 导出为便携格式。

```bash
llmwiki export [options]
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--target <name>` | 全部 target | 只导出指定格式。 |
| `--source <kind>` | `all` | 仅对 `marp` target 生效，选择 slide deck 包含哪些页面。 |

`--target` 可选值：

| 值 | 输出文件 |
| --- | --- |
| `llms-txt` | `dist/exports/llms.txt` |
| `llms-full-txt` | `dist/exports/llms-full.txt` |
| `json` | `dist/exports/wiki.json` |
| `json-ld` | `dist/exports/wiki.jsonld` |
| `graphml` | `dist/exports/wiki.graphml` |
| `marp` | `dist/exports/wiki.md` |

`--source` 可选值：

| 值 | 说明 |
| --- | --- |
| `concepts` | Marp deck 只包含 `wiki/concepts/`。 |
| `queries` | Marp deck 只包含 `wiki/queries/`。 |
| `all` | Marp deck 同时包含 concepts 和 queries。 |

```bash
llmwiki export
llmwiki export --target json
llmwiki export --target marp --source concepts
```

## `view`

启动只读本地 web viewer。

```bash
llmwiki view [options]
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--port <port>` | `0` | 绑定端口。`0` 表示由操作系统分配空闲端口。合法范围 `0-65535`。 |
| `--host <host>` | `127.0.0.1` | 绑定地址。绑定非 loopback 地址时必须同时传 `--allow-lan`。 |
| `--allow-lan` | `false` | 允许绑定到 loopback 之外的指定 host。必须与 `--host` 同时使用。 |
| `--open` | `false` | 启动后用系统默认浏览器打开 viewer URL。 |
| `-p, --project <id>` | active project | 查看指定项目。 |
| `--all` | `false` | 查看所有项目，并启用项目切换器。 |

```bash
llmwiki view
llmwiki view --open
llmwiki view --port 3000
llmwiki view --project nvme-wiki
llmwiki view --all --open
llmwiki view --host 192.168.1.10 --allow-lan
```

安全规则：

- 默认只绑定 `127.0.0.1`。
- `--host` 和 `--allow-lan` 必须成对出现；只传其中一个会失败。
- 不支持 wildcard host，例如 `0.0.0.0`、`::`、`*`，因为会破坏 viewer 的 DNS-rebind 防护模型。

## `serve`

通过 stdio 启动 MCP server，让 AI agent 使用 llmwiki 工具和资源。

```bash
llmwiki serve [options]
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--root <dir>` | 当前工作目录 | wiki 项目根目录。 |
| `--project <id>` | active project | 绑定到指定项目。 |

```bash
llmwiki serve --root /path/to/wiki-project
llmwiki serve --root /path/to/wiki-project --project nvme-wiki
```

注意事项：

- `serve` 本身不在启动时强制检查 LLM 凭证；只读 MCP 资源可以在无凭证时工作。
- 需要 LLM 的 MCP tool 会在调用时按 provider 检查凭证。

## `project`

管理多 wiki project。

```bash
llmwiki project <subcommand>
```

项目配置保存在 `.llmwiki/projects.json`。默认项目为 `default`，使用根目录的 `sources/` 和 `wiki/`。新增项目使用 `projects/<id>/sources/` 和 `projects/<id>/wiki/`。

| 命令 | 参数 | 说明 |
| --- | --- | --- |
| `llmwiki project add <id> <name>` | `<id>`、`<name>` 必填 | 创建新项目。 |
| `llmwiki project add <id> <name> -d <text>` | `-d, --description <text>` 可选 | 创建项目并写入描述。 |
| `llmwiki project list` | 无 | 列出所有项目并标记 active project。 |
| `llmwiki project switch <id>` | `<id>` 必填 | 切换 active project。 |
| `llmwiki project remove <id>` | `<id>` 必填 | 从配置中移除项目，不删除目录和文件。 |
| `llmwiki project show <id>` | `<id>` 必填 | 查看项目详细路径和状态。 |

```bash
llmwiki project add nvme-wiki "NVMe and SSD Wiki" --description "Storage protocols"
llmwiki project list
llmwiki project switch nvme-wiki
llmwiki project show nvme-wiki
llmwiki project remove nvme-wiki
```

创建项目时会生成：

- `projects/<id>/sources/`
- `projects/<id>/wiki/concepts/`
- `projects/<id>/wiki/queries/`
- `.llmwiki/projects/<id>/`

注意事项：

- 不能移除 `default` 项目。
- `project remove` 只删除配置，不删除项目目录和文件。
- 如果移除的是 active project，会切回 `default`。

## 多项目参数支持一览

| 命令 | 是否支持 `--project` | 说明 |
| --- | --- | --- |
| `ingest` | 是 | 导入到指定项目 sources。 |
| `compile` | 是 | 编译指定项目。 |
| `batch-compile` | 是 | 批量导入并编译指定项目。 |
| `view` | 是 | 查看指定项目；另有 `--all` 可查看所有项目。 |
| `serve` | 是 | MCP server 绑定指定项目。 |
| `query` | 否 | 当前读取 cwd 下 `wiki/`。 |
| `watch` | 否 | 当前监听 cwd 下 `sources/`。 |
| `lint` | 否 | 当前检查 cwd 下 `wiki/`。 |
| `schema` | 否 | 当前读取 cwd 下 `.llmwiki/schema.*`。 |
| `review` | 否 | 当前读取 cwd 下 `.llmwiki/candidates/`。 |
