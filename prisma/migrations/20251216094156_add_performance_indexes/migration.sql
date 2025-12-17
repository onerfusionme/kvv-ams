-- CreateIndex
CREATE INDEX "Asset_category_idx" ON "Asset"("category");

-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status");

-- CreateIndex
CREATE INDEX "Asset_departmentId_idx" ON "Asset"("departmentId");

-- CreateIndex
CREATE INDEX "Asset_locationId_idx" ON "Asset"("locationId");

-- CreateIndex
CREATE INDEX "Asset_createdAt_idx" ON "Asset"("createdAt");
