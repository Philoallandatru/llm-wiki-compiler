# CLI 测试报告

本报告记录本次为用户手册和 CLI 命令整理执行的验证结果。测试重点是确认命令能否按文档方式启动、解析参数、处理常见安全失败路径，并识别现有可疑问题。

## 命令级 smoke test

结果：31/31 通过。

已覆盖：

- 主命令与子命令帮助：`--help`、`--version`、`ingest --help`、`compile --help`、`review --help`、`project --help` 等。
- Schema：`schema init`、`schema show`。
- Project：`project add`、`list`、`show`、`switch`、`remove`。
- Ingest：本地 `.txt` 导入。
- Ingest session：Codex fixture 导入。
- Export：空 wiki 下 `export --target json`。
- Query：无 `wiki/index.md` 时的安全提示路径。
- Compile：无凭证时预期失败；使用 `LLMWIKI_PROVIDER=ollama` 且无 sources 时预期成功退出。
- View 安全校验：`--allow-lan` 缺少 `--host` 预期失败；wildcard host `0.0.0.0` 预期失败。
- 参数错误：非法 export target、缺失 batch folder 均按预期失败。

结论：

- 命令入口、帮助、基础参数解析和非 LLM 路径没有发现新的 CLI 使用问题。
- 需要真实 LLM 生成的路径没有调用外部 API，只验证了凭证和空输入边界。

## 全量测试

命令：

```bash
npm test
```

结果：失败。

摘要：

- Test files：76 passed，7 failed，1 skipped。
- Tests：852 passed，11 failed，3 skipped。

失败集中在以下几类：

| 类别 | 现象 |
| --- | --- |
| Windows spawn | `viewer-pack.test.ts` 中 `spawn npm ENOENT`。 |
| Windows 短路径 | `review-lock.test.ts` 期望 `C:\Users\Administrator...`，实际收到 `C:\Users\ADMINI~1...`。 |
| MCP read/status | `mcp-server.test.ts` 中 concept/query page 读取为 `null` 或 status 计数为 0。 |
| Viewer snapshot | regular `wiki/index.md` 被判断为 unavailable；`sources/` symlink confinement 测试得到外部文件。 |
| Viewer render contract | `/api/index` renderer failure 期望 500，实际 404。 |
| Credential smoke | `compile fails without Anthropic credentials` 超时；另有 `compile --review` 无 key 用例实际退出 0。 |

这些失败不是本次文档改动引入的命令级 smoke test 失败，但它们是当前仓库需要后续修复或重新校准测试期望的真实风险。

## 代码健康检查

命令：

```bash
npx fallow
```

结果：失败。

主要问题：

- Unused exports：`src/commands/batch-compile.ts` default export、`src/viewer/snapshot.ts` `buildProjectSnapshot`。
- Duplication：`src/viewer/snapshot.ts` 中 1 组重复代码。
- Complexity：`routeRegistered`、`projectListCommand`、`batchCompileCommand`、`setupProjectSymlinks` 等超过阈值。

我也运行了：

```bash
npx fallow fix --dry-run
```

它只建议移除两个 export。因为这两个 export 可能属于动态导入或公共测试边界，未自动应用，避免为了文档任务引入行为变化。

## 本次额外修复

`test/global-setup.ts` 原先用 `execFile("npx", ["tsup"])`。在当前 Windows 环境中，`execFile` 无法稳定执行 `npx` shim，导致测试在 global setup 阶段就失败。已改为通过 shell 调用本地 `node_modules/.bin/tsup`，让完整测试能够进入真实用例阶段。
