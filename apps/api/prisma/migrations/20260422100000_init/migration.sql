-- CreateTable
CREATE TABLE "organizations" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "plan_type" TEXT NOT NULL DEFAULT 'free',
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "display_name" TEXT,
  "auth_provider" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_accounts" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "external_account_id" TEXT NOT NULL,
  "oauth_status" TEXT NOT NULL,
  "token_encrypted" TEXT,
  "token_expires_at" TIMESTAMP(3),
  "last_sync_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_jobs" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "platform_account_id" TEXT NOT NULL,
  "queue_job_id" TEXT,
  "job_type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "cursor" TEXT,
  "error_code" TEXT,
  "error_message" TEXT,
  "started_at" TIMESTAMP(3),
  "finished_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment_configs" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "randomization_unit" TEXT,
  "core_metric" TEXT NOT NULL,
  "guard_metric" TEXT,
  "baseline" DOUBLE PRECISION NOT NULL,
  "mde" DOUBLE PRECISION NOT NULL,
  "alpha" DOUBLE PRECISION,
  "power" DOUBLE PRECISION,
  "traffic_daily" DOUBLE PRECISION,
  "attrition_rate" DOUBLE PRECISION,
  "sample_size_each" INTEGER NOT NULL,
  "recommended_days" INTEGER NOT NULL,
  "diagnosis" TEXT,
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "experiment_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_assets" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "brand_id" TEXT NOT NULL,
  "experiment_external_id" TEXT,
  "asset_type" TEXT,
  "source_url" TEXT,
  "thumbnail_url" TEXT,
  "duration_sec" INTEGER,
  "metrics_jsonb" JSONB,
  "winner_status" TEXT NOT NULL DEFAULT 'unknown',
  "version" INTEGER NOT NULL DEFAULT 1,
  "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "creative_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "label_tasks" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "queue_job_id" TEXT,
  "status" TEXT NOT NULL,
  "asset_count" INTEGER NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "created_by" TEXT,
  "error_code" TEXT,
  "error_message" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "started_at" TIMESTAMP(3),
  "finished_at" TIMESTAMP(3),
  CONSTRAINT "label_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_labels" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "asset_id" TEXT NOT NULL,
  "label_dimension" TEXT NOT NULL,
  "label_value" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION,
  "is_final" BOOLEAN NOT NULL,
  "updated_by" TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "asset_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_reports" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "queue_job_id" TEXT,
  "scope_jsonb" JSONB,
  "asset_count" INTEGER NOT NULL,
  "report_tier" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "summary_text" TEXT,
  "report_jsonb" JSONB,
  "pdf_url" TEXT,
  "created_by" TEXT,
  "error_code" TEXT,
  "error_message" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "started_at" TIMESTAMP(3),
  "finished_at" TIMESTAMP(3),
  CONSTRAINT "insight_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_records" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "endpoint" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "response_jsonb" JSONB NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "org_id" TEXT NOT NULL,
  "actor_user_id" TEXT,
  "action" TEXT NOT NULL,
  "resource_type" TEXT NOT NULL,
  "resource_id" TEXT,
  "request_id" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_org_id_idx" ON "users"("org_id");
CREATE INDEX "organizations_plan_type_idx" ON "organizations"("plan_type");
CREATE UNIQUE INDEX "platform_accounts_org_id_platform_external_account_id_key" ON "platform_accounts"("org_id", "platform", "external_account_id");
CREATE UNIQUE INDEX "sync_jobs_queue_job_id_key" ON "sync_jobs"("queue_job_id");
CREATE INDEX "sync_jobs_org_id_status_created_at_idx" ON "sync_jobs"("org_id", "status", "created_at" DESC);
CREATE INDEX "experiment_configs_org_id_created_at_idx" ON "experiment_configs"("org_id", "created_at");
CREATE INDEX "creative_assets_org_id_brand_id_platform_idx" ON "creative_assets"("org_id", "brand_id", "platform");
CREATE INDEX "creative_assets_org_id_winner_status_idx" ON "creative_assets"("org_id", "winner_status");
CREATE UNIQUE INDEX "label_tasks_queue_job_id_key" ON "label_tasks"("queue_job_id");
CREATE INDEX "label_tasks_org_id_status_created_at_idx" ON "label_tasks"("org_id", "status", "created_at" DESC);
CREATE UNIQUE INDEX "asset_labels_asset_id_label_dimension_label_value_is_final_key" ON "asset_labels"("asset_id", "label_dimension", "label_value", "is_final");
CREATE INDEX "asset_labels_org_id_asset_id_idx" ON "asset_labels"("org_id", "asset_id");
CREATE UNIQUE INDEX "insight_reports_queue_job_id_key" ON "insight_reports"("queue_job_id");
CREATE INDEX "insight_reports_org_id_created_at_idx" ON "insight_reports"("org_id", "created_at" DESC);
CREATE UNIQUE INDEX "idempotency_records_org_id_endpoint_idempotency_key_key" ON "idempotency_records"("org_id", "endpoint", "idempotency_key");
CREATE INDEX "idempotency_records_expires_at_idx" ON "idempotency_records"("expires_at");
CREATE INDEX "audit_logs_org_id_created_at_idx" ON "audit_logs"("org_id", "created_at" DESC);
