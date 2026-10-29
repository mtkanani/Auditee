-- Task attachments and client master documents can now be stored in R2 (storageKey)
-- instead of only being a pasted link (fileUrl).
ALTER TABLE "task_documents" ALTER COLUMN "fileUrl" DROP NOT NULL;
ALTER TABLE "task_documents" ADD COLUMN "storageKey" TEXT;

ALTER TABLE "client_documents" ALTER COLUMN "fileUrl" DROP NOT NULL;
ALTER TABLE "client_documents" ADD COLUMN "storageKey" TEXT;
