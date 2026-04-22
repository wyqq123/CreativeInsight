# CreativeInsight MVP Bootstrap

本文件用于激活项目的前后端/API/数据模型基础架构（对应 PRD 的 Module A/B/C）。

## 目录结构

- `apps/web`: Next.js 前端工作台
- `apps/api`: NestJS API 网关与领域模块（auth/billing/experiments/integrations/creatives/labeling/insights/jobs）
- `apps/worker`: BullMQ 异步任务 Worker（同步、打标、报告任务占位）
- `apps/api/prisma/schema.prisma`: Postgres 数据模型
- `apps/api/prisma/migrations/*`: Prisma migration SQL
- `docker-compose.yml`: PostgreSQL + Redis 本地依赖

## 已覆盖的核心 API（/api/v1）

- Calculator: `POST /calculator/estimate`
- ExperimentConfigs: `POST /experiment-configs`
- Integrations: `POST /integrations/oauth/{platform}/callback`
- SyncJobs: `POST /sync-jobs`, `GET /sync-jobs/{id}`
- Creatives: `GET /creatives`, `PATCH /creatives/{id}/winner-status`, `POST /creatives/batch/queue-labeling`
- Labeling: `POST /label-tasks`, `GET /label-tasks/{id}`, `POST /labels/review/confirm-batch`
- Insights: `POST /insight-reports`, `GET /insight-reports/{id}`, `POST /insight-reports/{id}/export-pdf`

## 激活步骤

1. 启动基础设施
   - `docker compose up -d`
2. 安装依赖
   - `npm install`
3. 复制环境变量
   - `copy .env.example .env`
4. 启动 API
   - `npm run dev:api`
5. 启动 Frontend
   - `npm run dev:web`
6. 启动 Worker
   - `npm run dev:worker`
7. 初始化数据库（首次）
   - `npm run prisma:generate -w apps/api`
   - `npm run prisma:migrate:deploy -w apps/api`

## 架构约束落实说明

- 所有写接口要求 `Idempotency-Key`
- 所有读写通过 `X-Org-Id` 做租户隔离
- 胜出素材状态更新使用 `lastKnownVersion` 进行乐观并发控制
- 响应遵循统一 envelope: `requestId/code/message/data`
- 幂等规则升级为 `(org_id + endpoint + idempotency_key)`，并设置 24h TTL
- 队列按业务拆分为 `sync-jobs`、`ai-label-jobs`、`report-jobs`
- API 通过 BullMQ 真实入队，Worker 通过内部回调推进任务状态机
- 审计日志写入 `audit_logs`，请求/任务指标通过 OTel API 埋点

## 下一步建议

- 根据 `docs/reference/api-spec.yaml` 补齐 DTO 验证器和 OpenAPI 自动文档
- 接入正式 OTel Exporter（OTLP -> Prometheus/Grafana/Tempo）
- 为 Worker 回调接口增加签名和重放防护
