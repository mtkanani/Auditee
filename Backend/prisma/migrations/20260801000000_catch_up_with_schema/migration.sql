-- Brings the migration history level with schema.prisma. The database used to be built with
-- `prisma db push`, so the 20260727 baseline was missing everything added after it.
-- Generated with: prisma migrate diff --from-schema-datamodel <schema at 7363f20> --to-schema-datamodel prisma/schema.prisma

-- CreateEnum
CREATE TYPE "LeaveAccrualMode" AS ENUM ('YEARLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('INTERNAL', 'CLIENT', 'AUDIT_REVIEW', 'TASK_DISCUSSION', 'TRAINING', 'SALES', 'INTERVIEW', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "MeetingMode" AS ENUM ('IN_APP_VIDEO', 'GOOGLE_MEET', 'ZOOM', 'TEAMS', 'IN_PERSON', 'PHONE_CALL');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "MeetingPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'MAYBE');

-- CreateEnum
CREATE TYPE "MeetingAttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- AlterTable
ALTER TABLE "firms" ADD COLUMN     "accountHolderName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bankNotes" TEXT,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "geofenceEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "geofenceRadiusMeters" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "officeAddress" TEXT,
ADD COLUMN     "officeLat" DOUBLE PRECISION,
ADD COLUMN     "officeLng" DOUBLE PRECISION,
ADD COLUMN     "upiId" TEXT;

-- CreateTable
CREATE TABLE "leave_policies" (
    "id" SERIAL NOT NULL,
    "firmId" INTEGER NOT NULL,
    "accrualMode" "LeaveAccrualMode" NOT NULL DEFAULT 'YEARLY',
    "casualLeaveQuota" DOUBLE PRECISION NOT NULL DEFAULT 12.0,
    "sickLeaveQuota" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "earnedLeaveQuota" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "perMonthCasual" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "perMonthSick" DOUBLE PRECISION NOT NULL DEFAULT 0.83,
    "perMonthEarned" DOUBLE PRECISION NOT NULL DEFAULT 1.25,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" SERIAL NOT NULL,
    "firmId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "agenda" TEXT,
    "meetingType" "MeetingType" NOT NULL DEFAULT 'CLIENT',
    "meetingMode" "MeetingMode" NOT NULL DEFAULT 'IN_APP_VIDEO',
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "priority" "MeetingPriority" NOT NULL DEFAULT 'MEDIUM',
    "department" TEXT,
    "location" TEXT,
    "meetingLink" TEXT,
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "createdById" INTEGER NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "isRecording" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_participants" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "clientId" INTEGER,
    "email" TEXT,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "meeting_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_attendance" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "clientId" INTEGER,
    "joinTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaveTime" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "status" "MeetingAttendanceStatus" NOT NULL DEFAULT 'PRESENT',

    CONSTRAINT "meeting_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_notes" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "decision" TEXT,
    "nextSteps" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_files" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "uploadedById" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_chat" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "senderUserId" INTEGER,
    "senderClientId" INTEGER,
    "message" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_recordings" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "recordingUrl" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_action_items" (
    "id" SERIAL NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedToUserId" INTEGER,
    "assignedToClientId" INTEGER,
    "dueDate" TIMESTAMP(3),
    "taskId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_action_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leave_policies_firmId_key" ON "leave_policies"("firmId");

-- CreateIndex
CREATE INDEX "leave_policies_firmId_idx" ON "leave_policies"("firmId");

-- CreateIndex
CREATE INDEX "meetings_firmId_status_meetingDate_idx" ON "meetings"("firmId", "status", "meetingDate");

-- CreateIndex
CREATE INDEX "meetings_createdById_idx" ON "meetings"("createdById");

-- CreateIndex
CREATE INDEX "meeting_participants_meetingId_idx" ON "meeting_participants"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_participants_userId_idx" ON "meeting_participants"("userId");

-- CreateIndex
CREATE INDEX "meeting_participants_clientId_idx" ON "meeting_participants"("clientId");

-- CreateIndex
CREATE INDEX "meeting_participants_email_idx" ON "meeting_participants"("email");

-- CreateIndex
CREATE INDEX "meeting_attendance_meetingId_idx" ON "meeting_attendance"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_attendance_userId_idx" ON "meeting_attendance"("userId");

-- CreateIndex
CREATE INDEX "meeting_notes_meetingId_idx" ON "meeting_notes"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_files_meetingId_idx" ON "meeting_files"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_chat_meetingId_createdAt_idx" ON "meeting_chat"("meetingId", "createdAt");

-- CreateIndex
CREATE INDEX "meeting_action_items_meetingId_idx" ON "meeting_action_items"("meetingId");

-- CreateIndex
CREATE INDEX "otps_email_createdAt_idx" ON "otps"("email", "createdAt");

-- CreateIndex
CREATE INDEX "otp_request_logs_email_createdAt_idx" ON "otp_request_logs"("email", "createdAt");

-- CreateIndex
CREATE INDEX "users_firmId_deletedAt_role_idx" ON "users"("firmId", "deletedAt", "role");

-- CreateIndex
CREATE INDEX "users_firmId_status_idx" ON "users"("firmId", "status");

-- CreateIndex
CREATE INDEX "clients_firmId_deletedAt_createdAt_idx" ON "clients"("firmId", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "clients_firmId_status_idx" ON "clients"("firmId", "status");

-- CreateIndex
CREATE INDEX "client_service_items_clientId_idx" ON "client_service_items"("clientId");

-- CreateIndex
CREATE INDEX "client_documents_clientId_idx" ON "client_documents"("clientId");

-- CreateIndex
CREATE INDEX "client_activity_logs_clientId_idx" ON "client_activity_logs"("clientId");

-- CreateIndex
CREATE INDEX "client_assignments_userId_idx" ON "client_assignments"("userId");

-- CreateIndex
CREATE INDEX "tasks_firmId_deletedAt_status_idx" ON "tasks"("firmId", "deletedAt", "status");

-- CreateIndex
CREATE INDEX "tasks_firmId_deletedAt_createdAt_idx" ON "tasks"("firmId", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "tasks_firmId_dueDate_idx" ON "tasks"("firmId", "dueDate");

-- CreateIndex
CREATE INDEX "tasks_clientId_deletedAt_idx" ON "tasks"("clientId", "deletedAt");

-- CreateIndex
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");

-- CreateIndex
CREATE INDEX "tasks_createdBy_idx" ON "tasks"("createdBy");

-- CreateIndex
CREATE INDEX "task_assignees_userId_idx" ON "task_assignees"("userId");

-- CreateIndex
CREATE INDEX "task_subtasks_taskId_idx" ON "task_subtasks"("taskId");

-- CreateIndex
CREATE INDEX "task_comments_taskId_idx" ON "task_comments"("taskId");

-- CreateIndex
CREATE INDEX "task_history_taskId_idx" ON "task_history"("taskId");

-- CreateIndex
CREATE INDEX "task_dependencies_dependsOnTaskId_idx" ON "task_dependencies"("dependsOnTaskId");

-- CreateIndex
CREATE INDEX "task_documents_taskId_idx" ON "task_documents"("taskId");

-- CreateIndex
CREATE INDEX "time_entries_taskId_idx" ON "time_entries"("taskId");

-- CreateIndex
CREATE INDEX "time_entries_userId_createdAt_idx" ON "time_entries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_clientId_idx" ON "user_sessions"("clientId");

-- CreateIndex
CREATE INDEX "forgot_password_otps_email_createdAt_idx" ON "forgot_password_otps"("email", "createdAt");

-- CreateIndex
CREATE INDEX "delete_account_otps_email_createdAt_idx" ON "delete_account_otps"("email", "createdAt");

-- CreateIndex
CREATE INDEX "compliance_items_firmId_status_idx" ON "compliance_items"("firmId", "status");

-- CreateIndex
CREATE INDEX "compliance_items_firmId_dueDate_idx" ON "compliance_items"("firmId", "dueDate");

-- CreateIndex
CREATE INDEX "compliance_items_clientId_idx" ON "compliance_items"("clientId");

-- CreateIndex
CREATE INDEX "announcements_firmId_deletedAt_createdAt_idx" ON "announcements"("firmId", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "announcement_reads_userId_idx" ON "announcement_reads"("userId");

-- CreateIndex
CREATE INDEX "leads_firmId_deletedAt_stage_idx" ON "leads"("firmId", "deletedAt", "stage");

-- CreateIndex
CREATE INDEX "lead_call_logs_leadId_idx" ON "lead_call_logs"("leadId");

-- CreateIndex
CREATE INDEX "lead_meeting_notes_leadId_idx" ON "lead_meeting_notes"("leadId");

-- CreateIndex
CREATE INDEX "lead_proposals_leadId_idx" ON "lead_proposals"("leadId");

-- CreateIndex
CREATE INDEX "invoices_firmId_deletedAt_status_idx" ON "invoices"("firmId", "deletedAt", "status");

-- CreateIndex
CREATE INDEX "invoices_firmId_deletedAt_issueDate_idx" ON "invoices"("firmId", "deletedAt", "issueDate");

-- CreateIndex
CREATE INDEX "invoices_clientId_deletedAt_idx" ON "invoices"("clientId", "deletedAt");

-- CreateIndex
CREATE INDEX "invoices_firmId_invoiceType_idx" ON "invoices"("firmId", "invoiceType");

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE INDEX "payment_records_invoiceId_idx" ON "payment_records"("invoiceId");

-- CreateIndex
CREATE INDEX "payment_records_paymentDate_idx" ON "payment_records"("paymentDate");

-- CreateIndex
CREATE INDEX "attendance_records_firmId_date_idx" ON "attendance_records"("firmId", "date");

-- CreateIndex
CREATE INDEX "attendance_entries_recordId_checkOutTime_idx" ON "attendance_entries"("recordId", "checkOutTime");

-- CreateIndex
CREATE INDEX "leave_requests_firmId_status_idx" ON "leave_requests"("firmId", "status");

-- CreateIndex
CREATE INDEX "leave_requests_userId_startDate_idx" ON "leave_requests"("userId", "startDate");

-- CreateIndex
CREATE INDEX "leave_balances_firmId_year_idx" ON "leave_balances"("firmId", "year");

-- CreateIndex
CREATE INDEX "document_vaults_firmId_deletedAt_category_idx" ON "document_vaults"("firmId", "deletedAt", "category");

-- CreateIndex
CREATE INDEX "document_vaults_clientId_idx" ON "document_vaults"("clientId");

-- CreateIndex
CREATE INDEX "document_vaults_taskId_idx" ON "document_vaults"("taskId");

-- CreateIndex
CREATE INDEX "events_userId_start_idx" ON "events"("userId", "start");

-- AddForeignKey
ALTER TABLE "leave_policies" ADD CONSTRAINT "leave_policies_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendance" ADD CONSTRAINT "meeting_attendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendance" ADD CONSTRAINT "meeting_attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendance" ADD CONSTRAINT "meeting_attendance_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_notes" ADD CONSTRAINT "meeting_notes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_notes" ADD CONSTRAINT "meeting_notes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_files" ADD CONSTRAINT "meeting_files_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_files" ADD CONSTRAINT "meeting_files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_chat" ADD CONSTRAINT "meeting_chat_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_chat" ADD CONSTRAINT "meeting_chat_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_chat" ADD CONSTRAINT "meeting_chat_senderClientId_fkey" FOREIGN KEY ("senderClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_recordings" ADD CONSTRAINT "meeting_recordings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_action_items" ADD CONSTRAINT "meeting_action_items_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

