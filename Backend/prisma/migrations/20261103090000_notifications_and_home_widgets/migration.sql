-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "audience" TEXT NOT NULL DEFAULT 'ALL';

-- AlterTable
ALTER TABLE "firms" ADD COLUMN     "monthlyBillingTarget" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "announcement_recipients" (
    "id" SERIAL NOT NULL,
    "announcementId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "announcement_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "firmId" INTEGER,
    "userId" INTEGER,
    "clientId" INTEGER,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_requests" (
    "id" SERIAL NOT NULL,
    "firmId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedBy" INTEGER,
    "receivedAt" TIMESTAMP(3),
    "lastRemindedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "announcement_recipients_userId_idx" ON "announcement_recipients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_recipients_announcementId_userId_key" ON "announcement_recipients"("announcementId", "userId");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId", "readAt");

-- CreateIndex
CREATE INDEX "notifications_clientId_createdAt_idx" ON "notifications"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_clientId_readAt_idx" ON "notifications"("clientId", "readAt");

-- CreateIndex
CREATE INDEX "document_requests_firmId_status_dueDate_idx" ON "document_requests"("firmId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "document_requests_clientId_status_idx" ON "document_requests"("clientId", "status");

-- CreateIndex
CREATE INDEX "client_activity_logs_createdAt_idx" ON "client_activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "task_history_createdAt_idx" ON "task_history"("createdAt");

-- AddForeignKey
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

