-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "app_user_id" TEXT NOT NULL,
    "link_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_link_id_idx" ON "customers"("link_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_project_id_app_user_id_key" ON "customers"("project_id", "app_user_id");

-- CreateIndex
CREATE INDEX "links_project_id_idx" ON "links"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "links_domain_code_key" ON "links"("domain", "code");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
