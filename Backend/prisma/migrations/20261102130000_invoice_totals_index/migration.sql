-- DropIndex
DROP INDEX "invoices_firmId_deletedAt_status_idx";

-- CreateIndex
CREATE INDEX "invoices_firmId_deletedAt_status_dueDate_totalAmount_paidAm_idx" ON "invoices"("firmId", "deletedAt", "status", "dueDate", "totalAmount", "paidAmount", "balanceAmount");

